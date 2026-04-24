import { useEffect, useRef } from 'react';
import { Activity, Globe, Zap, Database } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MarketDataTable } from '../components/LiveMarketData';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Globe, value: '50+', label: 'Markets Monitored' },
  { icon: Database, value: '1M+', label: 'Data Points/sec' },
  { icon: Zap, value: '<10ms', label: 'Latency' },
  { icon: Activity, value: '99.99%', label: 'Uptime' },
];

export default function MarketPulseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.market-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
      
      gsap.fromTo('.market-table',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
      
      gsap.fromTo('.market-stats',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
          scrollTrigger: { trigger: '.market-stats-grid', start: 'top 85%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="markets" ref={sectionRef} className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-[#070A12]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="market-title text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D6BFF]/10 border border-[#2D6BFF]/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#2D6BFF] animate-pulse" />
              <span className="text-xs font-medium text-[#2D6BFF]">Live Data Feed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4">
              Live Market <span className="text-gradient">Pulse</span>
            </h2>
            <p className="text-lg text-[#8B95A8] max-w-2xl mx-auto">
              Real-time data feeds power every decision—no lag, no guesswork. 
              Our AI processes millions of data points per second.
            </p>
          </div>

          {/* Market Data Table */}
          <div className="market-table mb-12">
            <MarketDataTable />
          </div>

          {/* Stats Grid */}
          <div className="market-stats-grid grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="market-stats pro-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2D6BFF]/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-[#2D6BFF]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] mb-1">{stat.value}</div>
                <div className="text-xs text-[#5A6578] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
