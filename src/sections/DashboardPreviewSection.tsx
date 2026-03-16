import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, PieChart, Wallet, Bell, Settings } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const holdings = [
  { name: 'AAPL', allocation: 25, value: '$12,450', change: '+2.34%', up: true },
  { name: 'MSFT', allocation: 20, value: '$9,960', change: '+1.89%', up: true },
  { name: 'NVDA', allocation: 15, value: '$7,470', change: '+4.56%', up: true },
  { name: 'GOOGL', allocation: 12, value: '$5,976', change: '-0.78%', up: false },
  { name: 'AMZN', allocation: 10, value: '$4,980', change: '+1.45%', up: true },
  { name: 'Others', allocation: 18, value: '$8,964', change: '+0.92%', up: true },
];

export default function DashboardPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        dashboardRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headlineRef} className="text-center mb-12 opacity-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4">
            Your portfolio, explained.
          </h2>
          <p className="text-[#A7B1C8] text-lg max-w-xl mx-auto">
            Track performance, allocation, and AI suggestions—clearly, in one place.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div
          ref={dashboardRef}
          className="glass-card overflow-hidden opacity-0"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[#F4F6FF] font-semibold">Portfolio Overview</h3>
                <p className="text-xs text-[#A7B1C8]">Last updated: Just now</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell className="w-5 h-5 text-[#A7B1C8]" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5 text-[#A7B1C8]" />
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Portfolio Value */}
            <div className="lg:col-span-2 space-y-6">
              {/* Total Value Card */}
              <div className="glass-card-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#A7B1C8] mb-1">Total Portfolio Value</p>
                    <h4 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF]">$49,800.00</h4>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#10B981] mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">+12.45%</span>
                    </div>
                    <p className="text-xs text-[#A7B1C8]">+$5,520 this month</p>
                  </div>
                </div>
                
                {/* Mini chart */}
                <div className="h-24 flex items-end gap-1">
                  {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 88, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#2D6BFF] to-[#2D6BFF]/30 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Holdings Table */}
              <div className="glass-card-sm p-4">
                <h5 className="text-[#F4F6FF] font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#2D6BFF]" />
                  Top Holdings
                </h5>
                <div className="space-y-3">
                  {holdings.map((holding) => (
                    <div key={holding.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <span className="text-xs font-semibold text-[#F4F6FF]">{holding.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm text-[#F4F6FF] font-medium">{holding.name}</p>
                          <p className="text-xs text-[#A7B1C8]">{holding.allocation}% allocation</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#F4F6FF] font-medium">{holding.value}</p>
                        <p className={`text-xs flex items-center gap-1 justify-end ${holding.up ? 'text-[#10B981]' : 'text-red-400'}`}>
                          {holding.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {holding.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Insights */}
            <div className="space-y-4">
              <div className="glass-card-sm p-4 border-l-2 border-[#2D6BFF]">
                <p className="mono-label text-[#2D6BFF] mb-2">AI Insight</p>
                <p className="text-sm text-[#F4F6FF] leading-relaxed">
                  Your portfolio is well-diversified. Consider increasing tech exposure by 5% based on current market momentum.
                </p>
              </div>

              <div className="glass-card-sm p-4">
                <h5 className="text-[#F4F6FF] font-semibold mb-3">Asset Allocation</h5>
                <div className="space-y-3">
                  {[
                    { label: 'Stocks', value: 65, color: '#2D6BFF' },
                    { label: 'Crypto', value: 20, color: '#8B5CF6' },
                    { label: 'Bonds', value: 10, color: '#10B981' },
                    { label: 'Cash', value: 5, color: '#F59E0B' },
                  ].map((asset) => (
                    <div key={asset.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#A7B1C8]">{asset.label}</span>
                        <span className="text-[#F4F6FF]">{asset.value}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${asset.value}%`, backgroundColor: asset.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card-sm p-4">
                <h5 className="text-[#F4F6FF] font-semibold mb-3">Daily Returns</h5>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-[#10B981] mb-1">+$124.50</div>
                  <p className="text-xs text-[#A7B1C8]">Today&apos;s profit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
