import {
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { AIBlogGenerator } from '../../components/admin/AIBlogGenerator';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NOW_MS = Date.now();
const WINDOW_MS = 30 * MS_PER_DAY;

function toMillis(value: any): number | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const t = Date.parse(value);
    return Number.isNaN(t) ? null : t;
  }
  if (typeof value === 'object') {
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (typeof value.seconds === 'number') return value.seconds * 1000;
  }
  return null;
}

function formatDelta(current: number, previous: number): { value: string; isUp: boolean } {
  if (previous === 0) {
    if (current === 0) return { value: '—', isUp: true };
    return { value: 'new', isUp: true };
  }
  const change = ((current - previous) / previous) * 100;
  const isUp = change >= 0;
  const value = `${isUp ? '+' : ''}${change.toFixed(1)}%`;
  return { value, isUp };
}

function relativeTime(ms: number): string {
  const diff = Math.max(0, NOW_MS - ms);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  return `${day} day${day === 1 ? '' : 's'} ago`;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timeMs: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<{ id: string; createdAtMs: number | null }[]>([]);
  const [portfolios, setPortfolios] = useState<{ id: string; totalInvested: number; availableBalance: number; totalReturns: number; activeInvestments: number }[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map((d) => ({
        id: d.id,
        createdAtMs: toMillis(d.data().createdAt),
      })));
    });

    const unsubPortfolios = onSnapshot(collection(db, 'portfolios'), (snap) => {
      setPortfolios(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          totalInvested: data.totalInvested || 0,
          availableBalance: data.availableBalance || 0,
          totalReturns: data.totalReturns || 0,
          activeInvestments: data.activeInvestments || 0,
        };
      }));
    });

    const unsubTransactions = onSnapshot(
      query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(50)),
      (snap) => {
        setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => console.error('Transactions listener:', err),
    );

    const unsubInvestments = onSnapshot(collection(db, 'investments'), (snap) => {
      setInvestments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUsers();
      unsubPortfolios();
      unsubTransactions();
      unsubInvestments();
    };
  }, []);

  // ── Derived stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const usersCurrentWindow = users.filter(u => u.createdAtMs && u.createdAtMs >= NOW_MS - WINDOW_MS).length;
    const usersPriorWindow = users.filter(u => u.createdAtMs && u.createdAtMs >= NOW_MS - 2 * WINDOW_MS && u.createdAtMs < NOW_MS - WINDOW_MS).length;
    const usersDelta = formatDelta(usersCurrentWindow, usersPriorWindow);

    const aum = portfolios.reduce((acc, p) => acc + p.totalInvested + p.availableBalance + p.totalReturns, 0);

    const activeStrategiesCount = portfolios.filter(p => p.activeInvestments > 0).length;
    const activeStrategiesPct = portfolios.length > 0 ? (activeStrategiesCount / portfolios.length) * 100 : 0;

    const depositsCurrent = transactions
      .filter(t => t.type === 'deposit' && t.status === 'confirmed')
      .filter(t => {
        const ms = toMillis(t.createdAt);
        return ms !== null && ms >= NOW_MS - WINDOW_MS;
      })
      .reduce((acc, t) => acc + (t.amountUsd ?? 0), 0);

    const depositsPrior = transactions
      .filter(t => t.type === 'deposit' && t.status === 'confirmed')
      .filter(t => {
        const ms = toMillis(t.createdAt);
        return ms !== null && ms >= NOW_MS - 2 * WINDOW_MS && ms < NOW_MS - WINDOW_MS;
      })
      .reduce((acc, t) => acc + (t.amountUsd ?? 0), 0);

    const depositsDelta = formatDelta(depositsCurrent, depositsPrior);

    return [
      {
        label: 'Total Users',
        value: totalUsers.toLocaleString(),
        sub: `+${usersCurrentWindow} last 30d`,
        change: usersDelta.value,
        isUp: usersDelta.isUp,
        icon: Users,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
      },
      {
        label: 'AUM',
        value: aum >= 1000 ? `$${(aum / 1000).toFixed(1)}K` : `$${aum.toFixed(0)}`,
        sub: `${portfolios.length} portfolios`,
        change: '',
        isUp: true,
        icon: DollarSign,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
      },
      {
        label: 'Active Strategies',
        value: `${activeStrategiesPct.toFixed(0)}%`,
        sub: `${activeStrategiesCount} of ${portfolios.length}`,
        change: '',
        isUp: true,
        icon: Activity,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
      },
      {
        label: 'Deposits (30d)',
        value: depositsCurrent >= 1000 ? `$${(depositsCurrent / 1000).toFixed(1)}K` : `$${depositsCurrent.toFixed(0)}`,
        sub: `vs prior 30d`,
        change: depositsDelta.value,
        isUp: depositsDelta.isUp,
        icon: Wallet,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
      },
    ];
  }, [users, portfolios, transactions]);

  // ── Monthly deposit volume chart (last 6 months, real data) ──────────────
  const chartData = useMemo(() => {
    const buckets: { name: string; volume: number; users: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ name: MONTH_LABELS[d.getMonth()], volume: 0, users: 0 });
    }

    const bucketIndex = (ms: number): number => {
      const d = new Date(ms);
      const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      const idx = 5 - monthsAgo;
      return idx >= 0 && idx <= 5 ? idx : -1;
    };

    transactions.forEach(t => {
      if (t.type !== 'deposit' || t.status !== 'confirmed') return;
      const ms = toMillis(t.createdAt);
      if (ms === null) return;
      const i = bucketIndex(ms);
      if (i >= 0) buckets[i].volume += t.amountUsd ?? 0;
    });

    users.forEach(u => {
      if (u.createdAtMs === null) return;
      const i = bucketIndex(u.createdAtMs);
      if (i >= 0) buckets[i].users += 1;
    });

    return buckets;
  }, [transactions, users]);

  // ── Recent activity (real, deduplicated, sorted) ─────────────────────────
  const recentActivity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    transactions.slice(0, 10).forEach(t => {
      const ms = toMillis(t.createdAt);
      if (ms === null) return;
      const usd = typeof t.amountUsd === 'number' ? t.amountUsd : null;
      const valueStr = usd !== null ? `$${usd.toLocaleString()}` : `${t.amount} ${t.currency || ''}`.trim();
      const title =
        t.type === 'deposit' ? 'Deposit' :
        t.type === 'withdrawal' ? 'Withdrawal' :
        t.type === 'referral_bonus' ? 'Referral bonus' :
        t.type === 'referral_commission' ? 'Referral commission' :
        'Transaction';
      items.push({
        id: `tx-${t.id}`,
        title: `${title} · ${t.status}`,
        description: `${t.userName || t.userId?.slice(0, 8) || 'User'} — ${valueStr}`,
        timeMs: ms,
      });
    });

    investments.slice(0, 10).forEach(i => {
      const ms = toMillis(i.startDate);
      if (ms === null) return;
      items.push({
        id: `inv-${i.id}`,
        title: `Investment ${i.status}`,
        description: `${i.userName || i.userId?.slice(0, 8) || 'User'} — ${i.planName} ($${(i.amount || 0).toLocaleString()})`,
        timeMs: ms,
      });
    });

    users.slice(0, 10).forEach(u => {
      if (u.createdAtMs === null) return;
      items.push({
        id: `user-${u.id}`,
        title: 'New user',
        description: `${u.id.slice(0, 8)} joined`,
        timeMs: u.createdAtMs,
      });
    });

    return items.sort((a, b) => b.timeMs - a.timeMs).slice(0, 6);
  }, [transactions, investments, users]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F4F6FF]">Admin Overview</h1>
        <p className="text-[#A7B1C8] mt-1">Real-time platform performance and user metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.change && (
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                  {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm text-[#A7B1C8]">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 text-[#F4F6FF]">{stat.value}</p>
              <p className="text-[10px] text-[#A7B1C8]/70 mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <AIBlogGenerator />
        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-[#A7B1C8]">
          View Analytics
        </Button>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg">Deposit Volume</h3>
              <p className="text-xs text-[#A7B1C8]">Confirmed deposits, last 6 months (USD)</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6BFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2D6BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#A7B1C8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A7B1C8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0E1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#F4F6FF' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                />
                <Area type="monotone" dataKey="volume" stroke="#2D6BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-10 text-[#A7B1C8] text-sm">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-20" />
              No activity yet.
            </div>
          ) : (
            <div className="space-y-5">
              {recentActivity.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    {item.id.startsWith('tx-') ? <Wallet className="w-5 h-5 text-[#2D6BFF]" /> :
                     item.id.startsWith('inv-') ? <Briefcase className="w-5 h-5 text-purple-400" /> :
                     <Users className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="space-y-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-[#A7B1C8] truncate">{item.description}</p>
                    <p className="text-[10px] text-[#A7B1C8]/50">{relativeTime(item.timeMs)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
