import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Clock, 
  Plus,
  Bell,
  LogOut,
  ChevronRight,
  Percent,
  Download,
  Upload
} from 'lucide-react';
import { useInvestment } from '../contexts/InvestmentContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CryptoPaymentModal from '../components/CryptoPaymentModal';
import AIInsights from '../components/AIInsights';
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



export default function Dashboard() {
  const { user, logout } = useAuth();
  const { portfolio, userInvestments, plans } = useInvestment();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalValue = portfolio.totalInvested + portfolio.totalReturns;
  const totalReturnPercent = portfolio.totalInvested > 0 
    ? (portfolio.totalReturns / portfolio.totalInvested) * 100 
    : 0;

  const getPlanById = (planId: string) => plans.find(p => p.id === planId);

  // Dynamic Allocation Data
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
    if (total === 0) return data.map(item => ({ ...item, value: 25 })); // Equal split for preview

    return data.map(item => ({
      ...item,
      value: Math.round((item.value / total) * 100)
    }));
  }, [userInvestments, portfolio.availableBalance, plans]);

  // Dynamic Performance Data (Simulated history based on current growth)
  const performanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const initialValue = portfolio.totalInvested || 1000;
    const growth = portfolio.totalReturns;
    
    // Generate 6 points leading up to current total
    return months.map((month, i) => {
      const progress = i / 5; // 0 to 1
      const baseValue = initialValue + (growth * progress);
      // Add subtle volatility for realism
      const variance = (Math.random() - 0.5) * (initialValue * 0.02);
      return {
        date: month,
        value: Math.max(0, Math.round(baseValue + variance))
      };
    });
  }, [totalValue, portfolio.totalInvested, portfolio.totalReturns]);

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF]">
              Welcome back, {user?.name}
            </h1>
            <p className="text-[#A7B1C8]">
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
            <button className="p-2 rounded-lg glass-card-sm hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-[#A7B1C8]" />
            </button>
            <button 
              onClick={logout}
              className="p-2 rounded-lg glass-card-sm hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-5 h-5 text-[#A7B1C8]" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#0D1220] border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#A7B1C8] font-normal">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-[#F4F6FF]">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{totalReturnPercent.toFixed(2)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D1220] border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#A7B1C8] font-normal">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-[#F4F6FF]">
                ${portfolio.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#A7B1C8]">
                <Wallet className="w-4 h-4" />
                <span className="text-sm">{portfolio.activeInvestments} active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D1220] border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#A7B1C8] font-normal">Total Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-[#10B981]">
                +${portfolio.totalReturns.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#10B981]">
                <Percent className="w-4 h-4" />
                <span className="text-sm">All time profit</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D1220] border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#A7B1C8] font-normal">Daily Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-[#10B981]">
                +${portfolio.dailyReturns.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#A7B1C8]">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Updated live</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <Card className="bg-[#0D1220] border-white/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#F4F6FF]">Portfolio Performance</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#A7B1C8] px-2 py-1 rounded-full bg-white/5">1M</span>
                    <span className="text-xs text-[#A7B1C8] px-2 py-1 rounded-full bg-white/5">3M</span>
                    <span className="text-xs text-[#F4F6FF] px-2 py-1 rounded-full bg-[#2D6BFF]">1Y</span>
                    <span className="text-xs text-[#A7B1C8] px-2 py-1 rounded-full bg-white/5">All</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2D6BFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2D6BFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#A7B1C8" fontSize={12} />
                      <YAxis stroke="#A7B1C8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0D1220', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#F4F6FF' }}
                        itemStyle={{ color: '#2D6BFF' }}
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
              </CardContent>
            </Card>

            {/* Active Investments */}
            <Card className="bg-[#0D1220] border-white/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#F4F6FF]">Active Investments</CardTitle>
                  <Link to="/plans" className="text-sm text-[#2D6BFF] hover:underline flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {userInvestments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <PieChart className="w-8 h-8 text-[#A7B1C8]" />
                    </div>
                    <p className="text-[#A7B1C8] mb-4">No active investments yet</p>
                    <Link to="/plans" className="btn-primary inline-flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Start Investing
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userInvestments.map((investment) => {
                      const plan = getPlanById(investment.planId);
                      return (
                        <div 
                          key={investment.id} 
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${plan?.color}20` }}
                            >
                              <TrendingUp className="w-5 h-5" style={{ color: plan?.color }} />
                            </div>
                            <div>
                              <p className="text-[#F4F6FF] font-medium">{investment.planName}</p>
                              <p className="text-xs text-[#A7B1C8]">
                                Started {new Date(investment.startDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#F4F6FF] font-medium">
                              ${investment.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-[#10B981]">
                              +${investment.totalReturn.toFixed(2)} earned
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Asset Allocation */}
            <Card className="bg-[#0D1220] border-white/5">
              <CardHeader>
                <CardTitle className="text-[#F4F6FF]">Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0D1220', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {allocationData.map((asset) => (
                    <div key={asset.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="text-sm text-[#A7B1C8]">{asset.name}</span>
                      </div>
                      <span className="text-sm text-[#F4F6FF]">{asset.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Balance */}
            <Card className="bg-[#0D1220] border-white/5">
              <CardHeader>
                <CardTitle className="text-[#F4F6FF]">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#F4F6FF] mb-4">
                  ${portfolio.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsDepositOpen(true)}
                    className="flex-1 btn-primary text-center text-sm py-2"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => setIsWithdrawOpen(true)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    Withdraw
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-[#0D1220] border-white/5">
              <CardHeader>
                <CardTitle className="text-[#F4F6FF]">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A7B1C8]">Active Investments</span>
                  <span className="text-[#F4F6FF] font-medium">{portfolio.activeInvestments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A7B1C8]">Avg. Daily Return</span>
                  <span className="text-[#10B981] font-medium">
                    ${portfolio.dailyReturns > 0 ? portfolio.dailyReturns.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A7B1C8]">Portfolio Health</span>
                  <span className="text-[#10B981] font-medium">Excellent</span>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic AI Insights */}
            <AIInsights />
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
