import { useEffect, useRef } from 'react';
import { 
  Bot, 
  Shield, 
  RefreshCw, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Portfolio Management',
    description: 'Our neural networks analyze millions of data points to construct and optimize your portfolio in real-time.',
    benefits: ['Real-time market analysis', 'Predictive modeling', 'Risk-adjusted allocations'],
    stat: '94.7%',
    statLabel: 'Prediction Accuracy',
    color: '#2D6BFF',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Military-grade encryption and multi-layered security protocols protect your assets 24/7.',
    benefits: ['AES-256 encryption', 'Multi-signature wallets', 'Cold storage'],
    stat: '$2.4B+',
    statLabel: 'Assets Protected',
    color: '#10B981',
  },
  {
    icon: RefreshCw,
    title: 'Smart Rebalancing',
    description: 'Tax-efficient portfolio adjustments that keep your strategy on track without manual work.',
    benefits: ['Drift monitoring', 'Tax-loss harvesting', 'Automatic execution'],
    stat: '0.5%',
    statLabel: 'Average Tax Savings',
    color: '#8B5CF6',
  },
];

export default function OverviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.overview-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
      
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.15,
          scrollTrigger: { trigger: '.features-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-[#070A12]">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#2D6BFF]/5 rounded-full blur-[100px] -translate-y-1/2" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="overview-title text-center mb-16">
            <span className="label-mono mb-4 block">Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4">
              Everything You Need to <span className="text-gradient">Build Wealth</span>
            </h2>
            <p className="text-lg text-[#8B95A8] max-w-2xl mx-auto">
              Powerful tools and features designed for modern investors who value 
              privacy, performance, and complete control.
            </p>
          </div>

          {/* Features Grid */}
          <div className="features-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="feature-card pro-card p-6 lg:p-8 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${feature.color}15` }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: feature.color }}>{feature.stat}</div>
                    <div className="text-xs text-[#5A6578]">{feature.statLabel}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#F4F6FF] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#8B95A8] leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2 mb-6">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-[#8B95A8]">
                      <CheckCircle2 className="w-4 h-4" style={{ color: feature.color }} />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Image Placeholder */}
                <div className="relative h-40 rounded-lg overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: `${feature.color}10` }}
                    >
                      <feature.icon className="w-8 h-8" style={{ color: feature.color, opacity: 0.5 }} />
                    </div>
                  </div>
                  {/* Decorative Grid */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `linear-gradient(${feature.color}10 1px, transparent 1px),
                                        linear-gradient(90deg, ${feature.color}10 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <Link 
              to="/features" 
              className="inline-flex items-center gap-2 text-[#2D6BFF] hover:text-[#5B8DEF] transition-colors"
            >
              <span className="font-medium">Explore All Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
