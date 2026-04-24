import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Play, 
  Zap,
  Eye,
  Lock,
  Globe,
  ChevronRight
} from 'lucide-react';
import gsap from 'gsap';
import { LiveTickerBar, PortfolioWidget, AssetAllocation } from '../components/LiveMarketData';
import { SecurityBadges, MediaMentions } from '../components/TrustSignals';

const uspFeatures = [
  { icon: Eye, label: 'Anonymous', sublabel: 'No KYC Required' },
  { icon: Lock, label: 'Self-Custody', sublabel: 'You Own Your Keys' },
  { icon: Globe, label: 'Global Access', sublabel: '180+ Countries' },
  { icon: Zap, label: 'Instant', sublabel: '24/7 Withdrawals' },
];

const stats = [
  { value: '$2.4B+', label: 'Assets Protected' },
  { value: '150K+', label: 'Active Investors' },
  { value: '94.7%', label: 'AI Accuracy' },
  { value: '0', label: 'Security Breaches' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    
    const ctx = gsap.context(() => {
      // Stagger animation for hero content
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-badges',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-stats',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-dashboard',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, delay: 0.6, ease: 'power3.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#070A12]">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2D6BFF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[100px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Live Ticker */}
      <div className="relative z-10">
        <LiveTickerBar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 section-padding py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div ref={contentRef} className="space-y-8">
              {/* Trust Badge */}
              <div className="hero-badges inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-medium text-[#10B981]">Trusted by 150,000+ investors</span>
              </div>

              {/* Title */}
              <div className="hero-title">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] leading-[1.1]">
                  Wealth Without
                  <br />
                  <span className="text-gradient">Borders or Boundaries</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="hero-subtitle text-lg text-[#8B95A8] max-w-xl leading-relaxed">
                The first AI-powered investment platform that respects your privacy. 
                Anonymous crypto deposits, instant withdrawals, and institutional-grade 
                returns—<span className="text-[#F4F6FF] font-medium">no banks, no borders, no compromises.</span>
              </p>

              {/* USP Features */}
              <div className="hero-badges flex flex-wrap gap-3">
                {uspFeatures.map((feature) => (
                  <div 
                    key={feature.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                  >
                    <feature.icon className="w-4 h-4 text-[#2D6BFF]" />
                    <div>
                      <span className="text-xs font-medium text-[#F4F6FF] block">{feature.label}</span>
                      <span className="text-[10px] text-[#5A6578]">{feature.sublabel}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="hero-cta flex flex-col sm:flex-row items-start gap-4">
                <Link 
                  to="/register" 
                  className="btn-primary flex items-center gap-2 text-base px-8 py-4"
                >
                  Start Building Wealth
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/about" 
                  className="btn-secondary flex items-center gap-2 text-base px-6 py-4"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Link>
              </div>

              {/* Security Badges */}
              <div className="hero-badges pt-4 border-t border-white/[0.06]">
                <SecurityBadges />
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="hero-dashboard relative">
              {/* Main Dashboard Card */}
              <div className="pro-card p-6 relative z-10">
                <PortfolioWidget />
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <AssetAllocation />
                  
                  {/* Quick Actions */}
                  <div className="pro-card p-4">
                    <h4 className="text-sm font-medium text-[#F4F6FF] mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-2 rounded-lg bg-[#10B981]/10 hover:bg-[#10B981]/20 transition-colors">
                        <span className="text-sm text-[#10B981]">Deposit</span>
                        <ChevronRight className="w-4 h-4 text-[#10B981]" />
                      </button>
                      <button className="w-full flex items-center justify-between p-2 rounded-lg bg-[#2D6BFF]/10 hover:bg-[#2D6BFF]/20 transition-colors">
                        <span className="text-sm text-[#2D6BFF]">Invest</span>
                        <ChevronRight className="w-4 h-4 text-[#2D6BFF]" />
                      </button>
                      <button className="w-full flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                        <span className="text-sm text-[#8B95A8]">Withdraw</span>
                        <ChevronRight className="w-4 h-4 text-[#8B95A8]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#2D6BFF]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#8B5CF6]/20 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="hero-stats mt-16 pt-8 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] mb-1">{stat.value}</div>
                  <div className="text-xs text-[#5A6578] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Mentions */}
          <div className="hero-stats mt-12">
            <MediaMentions />
          </div>
        </div>
      </div>
    </section>
  );
}
