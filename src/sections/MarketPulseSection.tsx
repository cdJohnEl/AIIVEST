import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const marketData = {
  indices: [
    { symbol: 'S&P 500', price: '4,783.45', change: '+1.23%', up: true },
    { symbol: 'NASDAQ', price: '15,123.68', change: '+2.15%', up: true },
    { symbol: 'DOW 30', price: '37,545.33', change: '-0.45%', up: false },
    { symbol: 'RUSSELL', price: '2,045.78', change: '+0.89%', up: true },
    { symbol: 'VIX', price: '13.42', change: '-5.23%', up: false },
    { symbol: 'FTSE 100', price: '7,682.30', change: '+0.67%', up: true },
    { symbol: 'DAX', price: '16,789.45', change: '+1.12%', up: true },
    { symbol: 'NIKKEI', price: '33,456.78', change: '-0.34%', up: false },
  ],
  stocks: [
    { symbol: 'AAPL', price: '185.92', change: '+1.45%', up: true },
    { symbol: 'MSFT', price: '378.91', change: '+2.34%', up: true },
    { symbol: 'GOOGL', price: '142.65', change: '-0.78%', up: false },
    { symbol: 'AMZN', price: '155.33', change: '+1.89%', up: true },
    { symbol: 'NVDA', price: '495.22', change: '+4.56%', up: true },
    { symbol: 'TSLA', price: '248.50', change: '-2.34%', up: false },
    { symbol: 'META', price: '398.72', change: '+3.21%', up: true },
    { symbol: 'NFLX', price: '485.90', change: '+1.67%', up: true },
  ],
  crypto: [
    { symbol: 'BTC', price: '$43,245.00', change: '+3.45%', up: true },
    { symbol: 'ETH', price: '$2,567.89', change: '+2.78%', up: true },
    { symbol: 'SOL', price: '$98.45', change: '+8.92%', up: true },
    { symbol: 'XRP', price: '$0.62', change: '-1.23%', up: false },
    { symbol: 'DOGE', price: '$0.089', change: '+5.67%', up: true },
    { symbol: 'ADA', price: '$0.58', change: '+1.34%', up: true },
    { symbol: 'DOT', price: '$7.45', change: '-0.89%', up: false },
    { symbol: 'LINK', price: '$14.23', change: '+4.12%', up: true },
  ],
};

function TickerPill({ item }: { item: { symbol: string; price: string; change: string; up: boolean } }) {
  return (
    <div className="flex-shrink-0 glass-card-sm px-4 py-3 mx-2 flex items-center gap-3">
      <span className="text-[#F4F6FF] font-semibold text-sm">{item.symbol}</span>
      <span className="text-[#A7B1C8] text-sm">{item.price}</span>
      <div className={`flex items-center gap-1 text-sm ${item.up ? 'text-[#10B981]' : 'text-red-400'}`}>
        {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{item.change}</span>
      </div>
    </div>
  );
}

function TickerBand({ items, reverse = false }: { items: typeof marketData.indices; reverse?: boolean }) {
  const doubledItems = [...items, ...items, ...items, ...items];
  
  return (
    <div className="overflow-hidden py-2">
      <div className={`flex ${reverse ? 'ticker-band-reverse' : 'ticker-band'}`}>
        {doubledItems.map((item, index) => (
          <TickerPill key={`${item.symbol}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function MarketPulseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="markets"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D1220]/50 via-transparent to-transparent" />

      <div className="relative z-10">
        <div ref={headlineRef} className="text-center mb-12 px-4 opacity-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4">
            Live market pulse
          </h2>
          <p className="text-[#A7B1C8] text-lg max-w-xl mx-auto">
            Real-time data feeds power every decision—no lag, no guesswork.
          </p>
        </div>

        {/* Ticker bands */}
        <div className="space-y-4">
          <TickerBand items={marketData.indices} />
          <TickerBand items={marketData.stocks} reverse />
          <TickerBand items={marketData.crypto} />
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-16 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Markets Monitored', value: '50+' },
              { label: 'Data Points/sec', value: '1M+' },
              { label: 'Uptime', value: '99.99%' },
              { label: 'Latency', value: '<10ms' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card-sm p-4 text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#2D6BFF] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[#A7B1C8] mono-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
