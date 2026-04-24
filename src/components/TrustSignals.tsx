import { useEffect, useState } from 'react';
import { 
  Shield, 
  Lock, 
  Award, 
  CheckCircle2, 
  TrendingUp,
  Users,
  Globe,
  Clock
} from 'lucide-react';

// Live counter hook
function useLiveCounter(start: number, end: number, duration: number = 2000) {
  const [value, setValue] = useState(start);
  
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(start + (end - start) * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [start, end, duration]);
  
  return value;
}

// Certification Badge Component
export function CertificationBadge({ name, logo, verified }: { name: string; logo: string; verified?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
      <div className="w-6 h-6 rounded bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center text-white text-xs font-bold">
        {logo}
      </div>
      <span className="text-sm text-[#8B95A8]">{name}</span>
      {verified && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
    </div>
  );
}

// Live Stat Counter
export function LiveStat({ value, label, prefix = '', suffix = '', decimals = 0 }: { 
  value: number; 
  label: string; 
  prefix?: string; 
  suffix?: string;
  decimals?: number;
}) {
  const animatedValue = useLiveCounter(0, value, 2500);
  
  return (
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-bold text-[#F4F6FF] mb-1">
        {prefix}{animatedValue.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </div>
      <div className="text-xs text-[#5A6578] uppercase tracking-wider">{label}</div>
    </div>
  );
}

// Security Badge Row
export function SecurityBadges() {
  const badges = [
    { icon: Shield, label: 'SOC 2 Type II', color: '#10B981' },
    { icon: Lock, label: '256-bit SSL', color: '#2D6BFF' },
    { icon: Award, label: 'ISO 27001', color: '#F59E0B' },
    { icon: CheckCircle2, label: 'Audited', color: '#8B5CF6' },
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {badges.map((badge) => (
        <div 
          key={badge.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: `${badge.color}15` }}
        >
          <badge.icon className="w-3.5 h-3.5" style={{ color: badge.color }} />
          <span className="text-xs font-medium" style={{ color: badge.color }}>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

// Trust Banner
export function TrustBanner() {
  return (
    <div className="pro-card p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#F4F6FF]">$2.4B+</div>
            <div className="text-xs text-[#5A6578]">Assets Protected</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2D6BFF]/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2D6BFF]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#F4F6FF]">150K+</div>
            <div className="text-xs text-[#5A6578]">Active Investors</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#F4F6FF]">180+</div>
            <div className="text-xs text-[#5A6578]">Countries</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#F4F6FF]">99.99%</div>
            <div className="text-xs text-[#5A6578]">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Media Mentions
export function MediaMentions() {
  const outlets = ['Forbes', 'Bloomberg', 'TechCrunch', 'CoinDesk', 'WSJ', 'Reuters'];
  
  return (
    <div className="text-center">
      <p className="text-xs text-[#5A6578] uppercase tracking-wider mb-4">Featured In</p>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-50">
        {outlets.map((outlet) => (
          <span key={outlet} className="text-lg font-semibold text-[#8B95A8]">
            {outlet}
          </span>
        ))}
      </div>
    </div>
  );
}

// Testimonial Card
export function TestimonialCard({ 
  quote, 
  author, 
  role, 
  company, 
  avatar,
  rating = 5 
}: { 
  quote: string; 
  author: string; 
  role: string; 
  company: string;
  avatar: string;
  rating?: number;
}) {
  return (
    <div className="pro-card p-6">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <TrendingUp 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-[#F59E0B]' : 'text-[#5A6578]'}`} 
          />
        ))}
      </div>
      <p className="text-[#8B95A8] leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div>
          <div className="text-sm font-medium text-[#F4F6FF]">{author}</div>
          <div className="text-xs text-[#5A6578]">{role}, {company}</div>
        </div>
      </div>
    </div>
  );
}

// Live Market Ticker
export function LiveTicker() {
  const [prices, setPrices] = useState([
    { symbol: 'BTC', price: 67432.50, change: 2.34 },
    { symbol: 'ETH', price: 3456.78, change: 1.89 },
    { symbol: 'SOL', price: 198.45, change: 5.67 },
    { symbol: 'NVDA', price: 875.32, change: 3.21 },
    { symbol: 'AAPL', price: 195.89, change: -0.45 },
    { symbol: 'MSFT', price: 423.56, change: 1.12 },
    { symbol: 'GOOGL', price: 142.67, change: -0.78 },
    { symbol: 'AMZN', price: 178.34, change: 2.15 },
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: p.price * (1 + (Math.random() - 0.5) * 0.001),
        change: p.change + (Math.random() - 0.5) * 0.1
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const doubledPrices = [...prices, ...prices];
  
  return (
    <div className="overflow-hidden py-4 border-y border-white/[0.06]">
      <div className="ticker flex gap-8 whitespace-nowrap">
        {doubledPrices.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#F4F6FF]">{item.symbol}</span>
            <span className="text-sm text-[#8B95A8]">${item.price.toFixed(2)}</span>
            <span className={`text-sm ${item.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Partner Logos
export function PartnerLogos() {
  const partners = [
    { name: 'Fireblocks', category: 'Custody' },
    { name: 'Chainalysis', category: 'Compliance' },
    { name: 'CoinGecko', category: 'Data' },
    { name: 'Alchemy', category: 'Infra' },
    { name: 'Ledger', category: 'Security' },
    { name: 'Messari', category: 'Research' },
  ];
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {partners.map((partner) => (
        <div key={partner.name} className="pro-card p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold">{partner.name[0]}</span>
          </div>
          <div className="text-xs font-medium text-[#F4F6FF]">{partner.name}</div>
          <div className="text-[10px] text-[#5A6578]">{partner.category}</div>
        </div>
      ))}
    </div>
  );
}

// Risk Disclosure Banner
export function RiskBanner() {
  return (
    <div className="pro-card p-4 border-l-2 border-[#F59E0B]">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
        </div>
        <div>
          <p className="text-sm text-[#8B95A8] leading-relaxed">
            <span className="text-[#F4F6FF] font-medium">Investment Risk:</span> All investments carry risk, 
            including possible loss of principal. Past performance does not guarantee future results. 
            Please invest responsibly and only what you can afford to lose.
          </p>
        </div>
      </div>
    </div>
  );
}
