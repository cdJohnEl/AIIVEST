import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  high24h: number;
  low24h: number;
}

const initialData: MarketData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67432.50, change: 1543.20, changePercent: 2.34, volume: '$34.2B', high24h: 68200.00, low24h: 65800.00 },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: 64.12, changePercent: 1.89, volume: '$18.5B', high24h: 3510.00, low24h: 3380.00 },
  { symbol: 'SOL', name: 'Solana', price: 198.45, change: 10.67, changePercent: 5.67, volume: '$4.2B', high24h: 205.00, low24h: 186.00 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.32, change: 27.23, changePercent: 3.21, volume: '$45.8B', high24h: 882.00, low24h: 845.00 },
  { symbol: 'AAPL', name: 'Apple', price: 195.89, change: -0.89, changePercent: -0.45, volume: '$52.1B', high24h: 198.50, low24h: 194.00 },
  { symbol: 'MSFT', name: 'Microsoft', price: 423.56, change: 4.68, changePercent: 1.12, volume: '$28.3B', high24h: 428.00, low24h: 416.00 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 142.67, change: -1.12, changePercent: -0.78, volume: '$22.7B', high24h: 145.00, low24h: 141.00 },
  { symbol: 'AMZN', name: 'Amazon', price: 178.34, change: 3.76, changePercent: 2.15, volume: '$38.9B', high24h: 180.00, low24h: 173.00 },
];

// Sparkline component
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-8" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={positive ? '#10B981' : '#EF4444'}
        strokeWidth="2"
        points={points}
      />
      <defs>
        <linearGradient id={`gradient-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill={`url(#gradient-${positive})`}
        points={`0,100 ${points} 100,100`}
      />
    </svg>
  );
}

// Mini Chart Data Generator
function generateSparklineData(length: number, trend: 'up' | 'down' | 'neutral') {
  const data: number[] = [50];
  for (let i = 1; i < length; i++) {
    const change = (Math.random() - 0.5) * 10;
    const trendBias = trend === 'up' ? 2 : trend === 'down' ? -2 : 0;
    data.push(Math.max(10, Math.min(90, data[i - 1] + change + trendBias)));
  }
  return data;
}

export function MarketDataTable() {
  const [data, setData] = useState(initialData);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => {
        const volatility = 0.002;
        const priceChange = item.price * (Math.random() - 0.5) * volatility;
        const newPrice = Math.max(0.01, item.price + priceChange);
        const newChange = item.change + priceChange;
        const newChangePercent = (newChange / (item.price - item.change)) * 100;
        
        return {
          ...item,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
        };
      }));
      setLastUpdate(new Date());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="pro-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2D6BFF]" />
          <span className="font-medium text-[#F4F6FF]">Live Market Data</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#5A6578]">
          <Clock className="w-3 h-3" />
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="py-3 px-4 text-xs font-medium text-[#5A6578] uppercase tracking-wider">Asset</th>
              <th className="py-3 px-4 text-xs font-medium text-[#5A6578] uppercase tracking-wider text-right">Price</th>
              <th className="py-3 px-4 text-xs font-medium text-[#5A6578] uppercase tracking-wider text-right">24h Change</th>
              <th className="py-3 px-4 text-xs font-medium text-[#5A6578] uppercase tracking-wider text-right">24h High</th>
              <th className="py-3 px-4 text-xs font-medium text-[#5A6578] uppercase tracking-wider text-right">24h Low</th>
              <th className="py-3 px-4 text-xs font-medium text-[#5A6578] uppercase tracking-wider text-right">Volume</th>
              <th className="py-3 px-4 text-xs font-medium text-[#5A6578] uppercase tracking-wider text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.symbol} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D6BFF]/20 to-[#2D6BFF]/5 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#2D6BFF]">{item.symbol[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium text-[#F4F6FF]">{item.symbol}</div>
                      <div className="text-xs text-[#5A6578]">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-mono text-[#F4F6FF]">
                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`flex items-center justify-end gap-1 ${item.changePercent >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {item.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-mono">{item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-mono text-[#8B95A8]">${item.high24h.toLocaleString()}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-mono text-[#8B95A8]">${item.low24h.toLocaleString()}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-mono text-[#8B95A8]">{item.volume}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <Sparkline 
                    data={generateSparklineData(20, item.changePercent >= 0 ? 'up' : 'down')} 
                    positive={item.changePercent >= 0} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Live Ticker Bar
export function LiveTickerBar() {
  const [prices, setPrices] = useState([
    { symbol: 'BTC', price: 67432.50, change: 2.34 },
    { symbol: 'ETH', price: 3456.78, change: 1.89 },
    { symbol: 'SOL', price: 198.45, change: 5.67 },
    { symbol: 'NVDA', price: 875.32, change: 3.21 },
    { symbol: 'AAPL', price: 195.89, change: -0.45 },
    { symbol: 'MSFT', price: 423.56, change: 1.12 },
    { symbol: 'GOOGL', price: 142.67, change: -0.78 },
    { symbol: 'AMZN', price: 178.34, change: 2.15 },
    { symbol: 'TSLA', price: 248.50, change: -2.34 },
    { symbol: 'META', price: 498.72, change: 3.45 },
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: p.price * (1 + (Math.random() - 0.5) * 0.001),
        change: p.change + (Math.random() - 0.5) * 0.05
      })));
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  const doubledPrices = [...prices, ...prices];
  
  return (
    <div className="relative overflow-hidden py-3 bg-[#0D1220] border-y border-white/[0.06]">
      <div className="ticker flex items-center gap-8 whitespace-nowrap">
        {doubledPrices.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F4F6FF]">{item.symbol}</span>
            <span className="text-sm font-mono text-[#8B95A8]">${item.price.toFixed(2)}</span>
            <span className={`text-sm font-mono ${item.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Portfolio Performance Widget
export function PortfolioWidget() {
  const [portfolio, setPortfolio] = useState({
    totalValue: 49800.00,
    totalReturn: 5240.50,
    returnPercent: 11.76,
    dailyChange: 324.80,
    dailyPercent: 0.66,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prev => {
        const change = prev.totalValue * (Math.random() - 0.5) * 0.002;
        const newValue = prev.totalValue + change;
        const newDaily = prev.dailyChange + change;
        return {
          ...prev,
          totalValue: newValue,
          dailyChange: newDaily,
          dailyPercent: (newDaily / (newValue - newDaily)) * 100,
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="pro-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[#5A6578] uppercase tracking-wider mb-1">Portfolio Value</p>
          <p className="text-3xl font-bold text-[#F4F6FF]">
            ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 ${portfolio.dailyChange >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {portfolio.dailyChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-mono font-medium">
              {portfolio.dailyChange >= 0 ? '+' : ''}${portfolio.dailyChange.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-[#5A6578]">Today</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-white/[0.03]">
          <p className="text-xs text-[#5A6578] mb-1">Total Return</p>
          <p className="text-lg font-semibold text-[#10B981]">+${portfolio.totalReturn.toLocaleString()}</p>
          <p className="text-xs text-[#10B981]">+{portfolio.returnPercent.toFixed(2)}%</p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03]">
          <p className="text-xs text-[#5A6578] mb-1">Daily Return</p>
          <p className={`text-lg font-semibold ${portfolio.dailyChange >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {portfolio.dailyChange >= 0 ? '+' : ''}{portfolio.dailyPercent.toFixed(2)}%
          </p>
          <p className="text-xs text-[#5A6578]">24h</p>
        </div>
      </div>
    </div>
  );
}

// Asset Allocation Chart
export function AssetAllocation() {
  const allocation = [
    { name: 'Stocks', value: 65, color: '#2D6BFF' },
    { name: 'Crypto', value: 20, color: '#8B5CF6' },
    { name: 'Bonds', value: 10, color: '#10B981' },
    { name: 'Cash', value: 5, color: '#F59E0B' },
  ];
  
  const total = allocation.reduce((acc, item) => acc + item.value, 0);
  let cumulativePercent = 0;
  
  return (
    <div className="pro-card p-6">
      <h3 className="text-sm font-medium text-[#F4F6FF] mb-4">Asset Allocation</h3>
      
      {/* Donut Chart */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {allocation.map((item) => {
            const percent = (item.value / total) * 100;
            const dashArray = `${percent} ${100 - percent}`;
            const offset = 100 - cumulativePercent;
            cumulativePercent += percent;
            
            return (
              <circle
                key={item.name}
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeDasharray={dashArray}
                strokeDashoffset={offset}
                className="transition-all duration-500"
              />
            );
          })}
          <circle cx="18" cy="18" r="12" fill="#141B2D" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[#F4F6FF]">4</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="space-y-2">
        {allocation.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-[#8B95A8]">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-[#F4F6FF]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
