import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Shield, Zap, Eye, Lock, Globe } from 'lucide-react';
import gsap from 'gsap';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Orb animation
      gsap.fromTo(
        orbRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
      );

      // Headline animation
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
      );

      // Subheadline animation
      gsap.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' }
      );

      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'power2.out' }
      );

      // Badges animation
      gsap.fromTo(
        badgesRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power2.out' }
      );

      // Continuous orb float
      gsap.to(orbRef.current, {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const uspBadges = [
    { icon: Eye, label: 'Anonymous', sublabel: 'No KYC Required' },
    { icon: Lock, label: 'Self-Custody', sublabel: 'You Own Your Keys' },
    { icon: Globe, label: 'Global Access', sublabel: '180+ Countries' },
    { icon: Zap, label: 'Instant', sublabel: '24/7 Withdrawals' },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0D1220] via-[#070A12] to-[#070A12]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2D6BFF]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Orb */}
      <div
        ref={orbRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(58vw,72vh)] h-[min(58vw,72vh)] opacity-0"
      >
        <img
          src="/images/hero_orb.jpg"
          alt="AI Investment"
          className="w-full h-full object-contain rounded-full"
          style={{
            filter: 'drop-shadow(0 0 80px rgba(45, 107, 255, 0.3))',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20">
        {/* Top Stats badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="glass-card-sm px-4 py-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2D6BFF]" />
            <span className="text-sm text-[#A7B1C8]">Avg. ROI: <span className="text-[#F4F6FF] font-semibold">24.5%</span></span>
          </div>
          <div className="glass-card-sm px-4 py-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm text-[#A7B1C8]">Zero Breaches <span className="text-[#F4F6FF] font-semibold">Since 2020</span></span>
          </div>
          <div className="glass-card-sm px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm text-[#A7B1C8]">AI Accuracy <span className="text-[#F4F6FF] font-semibold">94.7%</span></span>
          </div>
        </div>

        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#F4F6FF] leading-[0.95] tracking-tight mb-6 opacity-0"
        >
          Wealth Without
          <br />
          <span className="text-gradient">Borders or Boundaries.</span>
        </h1>

        <p
          ref={subheadlineRef}
          className="text-lg sm:text-xl text-[#A7B1C8] max-w-2xl mx-auto mb-8 leading-relaxed opacity-0"
        >
          The first AI-powered investment platform that respects your privacy. 
          Anonymous crypto deposits, instant withdrawals, and institutional-grade 
          returns—<span className="text-[#F4F6FF] font-semibold">no banks, no borders, no compromises.</span>
        </p>

        {/* USP Badges */}
        <div 
          ref={badgesRef}
          className="flex flex-wrap justify-center gap-4 mb-10 opacity-0"
        >
          {uspBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 glass-card-sm px-4 py-2">
              <badge.icon className="w-4 h-4 text-[#2D6BFF]" />
              <div className="text-left">
                <span className="text-xs text-[#F4F6FF] font-medium block">{badge.label}</span>
                <span className="text-[10px] text-[#A7B1C8]">{badge.sublabel}</span>
              </div>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base pulse-glow">
            Start Building Wealth
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/about" className="btn-secondary flex items-center gap-2 text-base">
            <Play className="w-4 h-4" />
            Our Story
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-[#A7B1C8] mb-4 mono-label">Trusted by 150,000+ investors across 180 countries</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-[#A7B1C8] font-semibold text-sm">Bloomberg</div>
            <div className="text-[#A7B1C8] font-semibold text-sm">Forbes</div>
            <div className="text-[#A7B1C8] font-semibold text-sm">CoinDesk</div>
            <div className="text-[#A7B1C8] font-semibold text-sm">TechCrunch</div>
            <div className="text-[#A7B1C8] font-semibold text-sm">WSJ</div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070A12] to-transparent" />
    </section>
  );
}
