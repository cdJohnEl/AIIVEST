import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  TrendingUp, 
  TrendingDown,
  Wallet, 
  PieChart, 
  Plus,
  Bell,
  LogOut,
  ChevronRight,
  Percent,
  Download,
  Upload,
  Activity,
  Eye,
  RefreshCw,
  ArrowDownRight,
  ArrowUpRight,
  UsersRound,
  Copy,
  Check,
  Share2,
  Award
} from 'lucide-react';
import { useInvestment } from '../contexts/InvestmentContext';
import { useAuth } from '../contexts/AuthContext';
import CryptoPaymentModal from '../components/CryptoPaymentModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

// Live data hook
function useLivePortfolio() {
  const { portfolio } = useInvestment();
  const [liveValue, setLiveValue] = useState(0);
  const [liveDaily, setLiveDaily] = useState(0);

  useEffect(() => {
    setLiveValue(portfolio.availableBalance + portfolio.totalInvested);
    setLiveDaily(portfolio.dailyReturns);
  }, [portfolio.availableBalance, portfolio.totalInvested, portfolio.dailyReturns]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const volatility = 0.0005;
      setLiveValue(prev => prev > 0 ? prev * (1 + (Math.random() - 0.5) * volatility) : 0);
      setLiveDaily(prev => prev > 0 ? prev + (Math.random() - 0.5) * 0.5 : 0);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return { liveValue, liveDaily };
}

// Skeleton shimmer component
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />
  );
}

// Skeleton stat card for loading state
function StatCardSkeleton() {
  return (
    <div className="pro-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// Skeleton table row for loading state
function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  subValue, 
  subLabel,
  positive = true,
  icon: Icon
}: { 
  title: string; 
  value: string; 
  subValue?: string;
  subLabel?: string;
  positive?: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="pro-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#5A6578] uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#8B95A8]" />
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] mb-1">{value}</div>
      {subValue && (
        <div className={`flex items-center gap-1 ${positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="text-xs">{subValue}</span>
          {subLabel && <span className="text-xs text-[#5A6578]">{subLabel}</span>}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { portfolio, userInvestments, plans, portfolioLoading } = useInvestment();
  const { liveValue, liveDaily } = useLivePortfolio();
  // Show active AND pending investments (pending = awaiting admin approval)
  const visibleInvestments = userInvestments.filter(inv => inv.status === 'active' || inv.status === 'pending');
  const activeInvestments = userInvestments.filter(inv => inv.status === 'active');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [refLoading, setRefLoading] = useState(true);

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  const handleCopyCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users'), where('referredBy', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReferredUsers(users);
      setRefLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      txs.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      setTransactions(txs);
      setTxLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setTxLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalReturnPercent = portfolio.totalInvested > 0 
    ? (portfolio.totalReturns / portfolio.totalInvested) * 100 
    : 0;

  const getPlanById = (planId: string) => plans.find(p => p.id === planId);

  const allocationData = useMemo(() => {
    const data = [
      { name: 'Stocks', value: 0, color: '#2D6BFF' },
      { name: 'Crypto', value: 0, color: '#8B5CF6' },
      { name: 'Bonds', value: 0, color: '#10B981' },
      { name: 'Cash', value: portfolio.availableBalance, color: '#F59E0B' },
    ];

    userInvestments.forEach((inv) => {
      const plan = getPlanById(inv.planId);
      if (!plan) return;
      if (plan.riskLevel === 'high' || inv.planId === 'crypto') {
        data[1].value += inv.amount + inv.totalReturn;
      } else if (plan.riskLevel === 'medium') {
        data[0].value += inv.amount + inv.totalReturn;
      } else {
        data[2].value += inv.amount + inv.totalReturn;
      }
    });

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return data.map(item => ({ ...item, value: 25 }));

    return data.map(item => ({
      ...item,
      value: Math.round((item.value / total) * 100)
    }));
  }, [userInvestments, portfolio.availableBalance, plans]);

  const performanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const totalValue = portfolio.availableBalance + portfolio.totalInvested;
    const initialValue = totalValue > 0 ? (totalValue - portfolio.totalReturns) : 1000;
    const growth = portfolio.totalReturns;
    
    return months.map((month, i) => {
      const progress = i / 5;
      const baseValue = initialValue + (growth * progress);
      const variance = (Math.random() - 0.5) * (initialValue * 0.02);
      return {
        date: month,
        value: Math.max(0, Math.round(baseValue + variance))
      };
    });
  }, [portfolio.availableBalance, portfolio.totalInvested, portfolio.totalReturns]);

  return (
    <div className="min-h-screen pt-20 pb-8 bg-[#070A12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[#5A6578]">Welcome back,</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF]">
              {user?.name}
            </h1>
            <p className="text-sm text-[#5A6578]">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Deposit
            </button>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Withdraw
            </button>
            <Link to="/plans" className="hidden sm:flex btn-primary items-center gap-2">
              <Plus className="w-4 h-4" />
              Invest
            </Link>
            <button className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
              <Bell className="w-5 h-5 text-[#8B95A8]" />
            </button>
            <button 
              onClick={logout}
              className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
            >
              <LogOut className="w-5 h-5 text-[#8B95A8]" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        {portfolioLoading ? (
            <>{[...Array(5)].map((_, i) => <StatCardSkeleton key={i} />)}</>
          ) : (<>
          <StatCard
            title="Portfolio Value"
            value={`$${liveValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subValue={`+${totalReturnPercent.toFixed(2)}%`}
            subLabel=" all time"
            positive={true}
            icon={Wallet}
          />
          <StatCard
            title="Total Invested"
            value={`$${(portfolio.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subValue={`${portfolio.activeInvestments || activeInvestments.length}`}
            subLabel=" active investments"
            positive={true}
            icon={PieChart}
          />
          <StatCard
            title="Investment Profit"
            value={`+$${(portfolio.totalReturns || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subValue="All time profit"
            positive={true}
            icon={Percent}
          />
          <StatCard
            title="Referral Proceeds"
            value={`+$${(portfolio.referralEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subValue="Bonuses & comms"
            positive={true}
            icon={UsersRound}
          />
          <StatCard
            title="Daily Returns"
            value={`+$${(portfolio.dailyReturns || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subValue="Expected daily"
            positive={true}
            icon={TrendingUp}
          />
          </>)}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <div className="pro-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#F4F6FF]">Portfolio Performance</h3>
                  <p className="text-xs text-[#5A6578]">Track your investment growth over time</p>
                </div>
                <div className="flex items-center gap-2">
                  {['1M', '3M', '6M', '1Y', 'All'].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        period === '1Y' 
                          ? 'bg-[#2D6BFF] text-white' 
                          : 'bg-white/[0.03] text-[#8B95A8] hover:bg-white/[0.06]'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2D6BFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2D6BFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141B2D', 
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}
                      labelStyle={{ color: '#F4F6FF', fontSize: '12px' }}
                      itemStyle={{ color: '#2D6BFF', fontSize: '13px' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2D6BFF" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Investments */}
            <div className="pro-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#F4F6FF]">Investments</h3>
                  <p className="text-xs text-[#5A6578]">Active &amp; pending approval</p>
                </div>
                <Link to="/plans" className="text-sm text-[#2D6BFF] hover:text-[#5B8DEF] transition-colors flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {visibleInvestments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                    <PieChart className="w-8 h-8 text-[#5A6578]" />
                  </div>
                  <p className="text-[#8B95A8] mb-4">No investments yet</p>
                  <Link to="/plans" className="btn-primary inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Start Investing
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleInvestments.map((investment) => {
                    const plan = getPlanById(investment.planId);
                    const isPending = investment.status === 'pending';
                    return (
                      <div 
                        key={investment.id} 
                        className={`flex items-center justify-between p-4 rounded-xl transition-colors border ${
                          isPending 
                            ? 'bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10' 
                            : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${plan?.color}15` }}
                          >
                            <TrendingUp className="w-5 h-5" style={{ color: plan?.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[#F4F6FF] font-medium">{investment.planName}</p>
                              {isPending && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse">
                                  Pending Approval
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#5A6578]">
                              {isPending ? 'Awaiting admin review' : `Started ${new Date(investment.startDate).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#F4F6FF] font-medium font-mono">
                            ${investment.amount.toLocaleString()}
                          </p>
                          <p className={`text-xs ${isPending ? 'text-yellow-500' : 'text-[#10B981]'}`}>
                            {isPending ? 'Pending' : `+$${(investment.totalReturn || 0).toFixed(2)} earned`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Asset Allocation */}
            <div className="pro-card p-6">
              <h3 className="text-lg font-semibold text-[#F4F6FF] mb-1">Asset Allocation</h3>
              <p className="text-xs text-[#5A6578] mb-4">Distribution across asset classes</p>
              
              <div className="h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141B2D', 
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px'
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                {allocationData.map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: asset.color }}
                      />
                      <span className="text-sm text-[#8B95A8]">{asset.name}</span>
                    </div>
                    <span className="text-sm font-medium text-[#F4F6FF]">{asset.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Balance */}
            <div className="pro-card p-6">
              <h3 className="text-lg font-semibold text-[#F4F6FF] mb-1">Available Balance</h3>
              <p className="text-xs text-[#5A6578] mb-4">Funds ready to invest</p>
              
              <div className="text-3xl font-bold text-[#F4F6FF] mb-6">
                ${portfolio.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDepositOpen(true)}
                  className="flex-1 btn-primary text-center text-sm py-2.5"
                >
                  Deposit
                </button>
                <button 
                  onClick={() => setIsWithdrawOpen(true)}
                  className="flex-1 btn-secondary text-sm py-2.5"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* Referral Center */}
            <div className="pro-card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#10B981]/10">
                    <Share2 className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#F4F6FF]">Referral Center</h3>
                    <p className="text-[10px] text-[#5A6578]">Earn up to 30% commissions</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  portfolio.referralCount > 50 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  portfolio.referralCount > 10 ? 'bg-[#2D6BFF]/20 text-[#2D6BFF] border border-[#2D6BFF]/30' :
                  'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                }`}>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {portfolio.referralCount > 50 ? 'Elite' : portfolio.referralCount > 10 ? 'Pro' : 'Starter'}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-[#A7B1C8] font-medium">Unique Referral Link</p>
                  <div className="flex items-center gap-2 bg-[#0D1220] p-2 rounded-lg border border-white/5">
                    <code className="text-[10px] text-[#2D6BFF] truncate flex-1">{referralLink}</code>
                    <button 
                      onClick={handleCopyLink}
                      className="p-1 hover:bg-white/5 rounded transition-colors"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3 text-[#5A6578]" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-[#A7B1C8] font-medium">Your Code: <span className="text-[#F4F6FF] uppercase font-bold">{user?.referralCode}</span></p>
                  <button 
                    onClick={handleCopyCode}
                    className="w-full btn-secondary text-[10px] py-1.5 flex items-center justify-center gap-2"
                  >
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-medium text-[#A7B1C8] mb-3 flex items-center justify-between">
                  <span>Your Network</span>
                  <span className="text-[#F4F6FF]">{referredUsers.length} members</span>
                </h4>
                {refLoading ? (
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => <div key={i} className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />)}
                  </div>
                ) : referredUsers.length === 0 ? (
                  <div className="text-center py-4 bg-white/[0.01] rounded-lg border border-dashed border-white/5">
                    <p className="text-[10px] text-[#5A6578]">No referrals yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                    {referredUsers.map((refUser) => (
                      <div key={refUser.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2">
                          <img 
                            src={refUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${refUser.email}`} 
                            alt={refUser.name}
                            className="w-6 h-6 rounded-full border border-white/10"
                          />
                          <div>
                            <p className="text-[10px] font-medium text-[#F4F6FF] truncate max-w-[80px]">{refUser.name}</p>
                            <p className="text-[8px] text-[#5A6578]">{new Date(refUser.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${
                          refUser.isVerified ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}>
                          {refUser.isVerified ? 'Verified' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pro-card p-6">
              <h3 className="text-lg font-semibold text-[#F4F6FF] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8B95A8]">Active Investments</span>
                  <span className="font-medium text-[#F4F6FF]">{portfolio.activeInvestments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8B95A8]">Avg. Daily Return</span>
                  <span className="font-medium text-[#10B981]">
                    ${liveDaily.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8B95A8]">Portfolio Health</span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="font-medium text-[#10B981]">Excellent</span>
                  </span>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="pro-card p-6 border-l-2 border-[#2D6BFF]" style={{ background: 'linear-gradient(145deg, rgba(45,107,255,0.08) 0%, rgba(20,27,45,0.8) 100%)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#2D6BFF] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <h3 className="text-sm font-semibold text-[#F4F6FF]">AI Insight</h3>
              </div>
              <p className="text-sm text-[#8B95A8] leading-relaxed">
                Your portfolio is performing well. Consider diversifying into Growth Accelerator 
                for potentially higher returns. Market conditions favor tech stocks this quarter.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Eye className="w-3 h-3 text-[#5A6578]" />
                <span className="text-xs text-[#5A6578]">Updated 2 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-6">
          <div className="pro-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCw className="w-5 h-5 text-[#A7B1C8]" />
              <h3 className="text-lg font-semibold text-[#F4F6FF]">Transaction History</h3>
            </div>
            {txLoading ? (
              <table className="w-full text-left border-collapse">
                <tbody>
                  {[...Array(4)].map((_, i) => <SkeletonTableRow key={i} cols={4} />)}
                </tbody>
              </table>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#8B95A8]">No transactions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-sm text-[#8B95A8]">
                      <th className="py-3 px-4 font-normal">Type</th>
                      <th className="py-3 px-4 font-normal">Amount</th>
                      <th className="py-3 px-4 font-normal">Status</th>
                      <th className="py-3 px-4 font-normal hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'deposit' || tx.type === 'referral_bonus' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}>
                              {tx.type === 'deposit' || tx.type === 'referral_bonus' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#F4F6FF] capitalize">
                                {tx.type.replace('_', ' ')}
                              </p>
                              <p className="text-xs text-[#8B95A8]">{tx.currency || 'USD'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-medium ${
                            tx.type === 'deposit' || tx.type === 'referral_bonus' ? 'text-[#10B981]' : 'text-[#EF4444]'
                          }`}>
                            {tx.type === 'deposit' || tx.type === 'referral_bonus' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs capitalize ${
                            tx.status === 'confirmed' ? 'bg-[#10B981]/10 text-[#10B981]' :
                            tx.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                            'bg-[#EF4444]/10 text-[#EF4444]'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell text-sm text-[#8B95A8]">
                          {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <CryptoPaymentModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        type="deposit" 
      />

      {/* Withdraw Modal */}
      <CryptoPaymentModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        type="withdraw" 
      />
    </div>
  );
}
