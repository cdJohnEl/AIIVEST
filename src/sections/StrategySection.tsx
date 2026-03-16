import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BarChart3, Target, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const strategies = [
  {
    icon: Sparkles,
    title: 'AI Signal Detection',
    description: 'Our neural networks analyze millions of data points to identify emerging opportunities.',
  },
  {
    icon: BarChart3,
    title: 'Dynamic Allocation',
    description: 'Portfolio weights adjust automatically based on market conditions and risk metrics.',
  },
  {
    icon: Target,
    title: 'Risk Optimization',
    description: 'Advanced algorithms minimize drawdowns while maximizing risk-adjusted returns.',
  },
  {
    icon: Clock,
    title: '24/7 Monitoring',
    description: 'Round-the-clock surveillance ensures your investments are always protected.',
  },
];

export default function StrategySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -60, scale: 0.98 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative opacity-0">
            <div className="relative rounded-[22px] overflow-hidden aspect-[4/5]">
              <img
                src="/images/strategy_spotlight.jpg"
                alt="AI Trading Strategy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/80 via-transparent to-transparent" />
            </div>
            
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 glass-card p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#F4F6FF]">94.7%</div>
                  <div className="text-xs text-[#A7B1C8]">Prediction Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="opacity-0">
            <span className="mono-label text-[#2D6BFF] mb-4 block">Strategy Spotlight</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-6 leading-tight">
              Adaptive strategies for real-world markets.
            </h2>
            <p className="text-[#A7B1C8] text-lg mb-8 leading-relaxed">
              Our AI evaluates macro signals, volatility regimes, and correlation shifts—
              then adjusts allocation to keep your plan resilient through any market condition.
            </p>

            {/* Strategy features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {strategies.map((strategy) => (
                <div key={strategy.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2D6BFF]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <strategy.icon className="w-4 h-4 text-[#2D6BFF]" />
                  </div>
                  <div>
                    <h4 className="text-[#F4F6FF] font-medium text-sm mb-1">{strategy.title}</h4>
                    <p className="text-[#A7B1C8] text-xs leading-relaxed">{strategy.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/plans" className="btn-primary inline-flex items-center gap-2">
              Explore Strategies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
