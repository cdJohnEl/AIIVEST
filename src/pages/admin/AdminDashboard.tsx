import { 
  Users, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet
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
  ResponsiveContainer 
} from 'recharts';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const data = [
  { name: 'Jan', users: 400, volume: 2400 },
  { name: 'Feb', users: 600, volume: 3200 },
  { name: 'Mar', users: 900, volume: 4800 },
  { name: 'Apr', users: 1200, volume: 6100 },
  { name: 'May', users: 1800, volume: 8400 },
  { name: 'Jun', users: 2400, volume: 12000 },
];

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAUM, setTotalAUM] = useState(0);
  const [activeStrategies, setActiveStrategies] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [chartData, setChartData] = useState<{name: string, users: number, volume: number}[]>([]);

  useEffect(() => {
    // 1. Total Users Listener
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersSize = snapshot.size;
      setTotalUsers(usersSize);
      
      // Calculate growth over time for chart
      const usersData = snapshot.docs.map(doc => ({
        createdAt: doc.data().createdAt || new Date().toISOString()
      }));
      
      // Process growth data (simplified: count by month)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const last6Months: {name: string, count: number, volume: number}[] = [];
      for(let i = 5; i >= 0; i--) {
        const m = (currentMonth - i + 12) % 12;
        last6Months.push({ name: months[m], count: 0, volume: 0 });
      }

      // Fill with real counts (simulated for historical, real for current)
      usersData.forEach(u => {
        const date = new Date(u.createdAt);
        const monthName = months[date.getMonth()];
        const entry = last6Months.find(e => e.name === monthName);
        if (entry) entry.count += 1;
      });

      // Cumulative count and mock volume growth
      let cumulative = usersSize > 100 ? 0 : 50; // Offset for demo if empty
      const finalData = last6Months.map((m) => {
        cumulative += m.count;
        return {
          name: m.name,
          users: cumulative,
          volume: cumulative * 1200 // Mock: average $1200 per user
        };
      });
      setChartData(finalData);
    });

    // 2. AUM & Active Strategies Listener
    const portfoliosUnsubscribe = onSnapshot(collection(db, 'portfolios'), (snapshot) => {
      let aum = 0;
      let activeCount = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        aum += (data.totalInvested || 0) + (data.availableBalance || 0);
        if (data.activeInvestments > 0) activeCount++;
      });
      setTotalAUM(aum);
      setActiveStrategies(snapshot.size > 0 ? (activeCount / snapshot.size) * 100 : 0);
      setTotalDeposits(aum * 0.85); // Simulated subset
    });

    return () => {
      usersUnsubscribe();
      portfoliosUnsubscribe();
    };
  }, []);

  const stats = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), change: '+12.5%', isUp: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'AUM (Volume)', value: `$${(totalAUM / 1000).toFixed(1)}K`, change: '+18.2%', isUp: true, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Strategy', value: `${activeStrategies.toFixed(0)}%`, change: '-2.4%', isUp: false, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Deposits', value: `$${(totalDeposits / 1000).toFixed(1)}K`, change: '+5.1%', isUp: true, icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

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
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-[#A7B1C8]">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 text-[#F4F6FF]">{stat.value}</p>
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
            <h3 className="font-bold text-lg">Growth Analysis</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6BFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2D6BFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#A7B1C8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#A7B1C8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0E1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#F4F6FF' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#2D6BFF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-[#2D6BFF]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New Deposit Method</p>
                  <p className="text-xs text-[#A7B1C8]">Anonymous Bitcoin mixing session #421 started.</p>
                  <p className="text-[10px] text-[#A7B1C8]/50">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-6 text-[#2D6BFF] hover:bg-[#2D6BFF]/10">
            View All Logs
          </Button>
        </div>
      </div>
    </div>
  );
}
