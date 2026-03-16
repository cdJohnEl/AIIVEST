import { useEffect, useRef } from 'react';
import { 
  Bot, 
  Shield, 
  RefreshCw, 
  TrendingUp, 
  Eye, 
  Zap,
  Globe,
  Lock,
  BarChart3,
  Bell,
  Wallet,
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
    description: 'Our advanced neural networks analyze millions of data points to construct and optimize your portfolio automatically.',
    details: ['Real-time market analysis', 'Predictive modeling', 'Risk-adjusted allocations', 'Automated rebalancing']
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your assets are protected with military-grade encryption and multi-layered security protocols.',
    details: ['AES-256 encryption', 'Multi-signature wallets', 'Cold storage', 'Regular security audits']
  },
  {
    icon: RefreshCw,
    title: 'Smart Rebalancing',
    description: 'Tax-efficient portfolio adjustments that keep your strategy on track without manual intervention.',
    details: ['Drift monitoring', 'Tax-loss harvesting', 'Fee optimization', 'Automatic execution']
  },
  {
    icon: Eye,
    title: 'Anonymous Investing',
    description: 'Invest with privacy. No invasive KYC required for crypto deposits under $10,000.',
    details: ['Crypto-only accounts', 'Privacy coin support', 'No personal data storage', 'Anonymous withdrawals']
  },
  {
    icon: Zap,
    title: 'Instant Withdrawals',
    description: 'Access your funds 24/7 with automated processing that moves at the speed of blockchain.',
    details: ['24/7 processing', 'Multiple crypto options', 'Low network fees', 'Fast confirmations']
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Available in 180+ countries. No bank account required—invest from anywhere in the world.',
    details: ['180+ countries', 'Multi-currency support', 'No banking restrictions', 'Borderless investing']
  },
];

const additionalFeatures = [
  { icon: Lock, title: 'Self-Custody Options', description: 'You control your private keys' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Deep insights into your portfolio' },
  { icon: Bell, title: 'Smart Alerts', description: 'Get notified of market opportunities' },
  { icon: Wallet, title: 'Multi-Wallet Support', description: 'Connect your existing wallets' },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="mono-label text-[#2D6BFF] mb-4 block">Features</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            Everything You Need to <span className="text-gradient">Build Wealth</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Powerful tools and features designed for modern investors who value privacy, 
            performance, and control.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card glass-card p-6 lg:p-8 hover:border-[#2D6BFF]/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2D6BFF]/20 to-[#2D6BFF]/5 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-[#2D6BFF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F4F6FF] mb-3">{feature.title}</h3>
              <p className="text-[#A7B1C8] mb-4 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-2 text-sm text-[#A7B1C8]">
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="glass-card p-8 lg:p-12 mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] text-center mb-8">
            More Powerful Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {additionalFeatures.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-[#2D6BFF]" />
                </div>
                <h4 className="text-[#F4F6FF] font-medium mb-1">{feature.title}</h4>
                <p className="text-xs text-[#A7B1C8]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#F4F6FF] mb-4">
            Ready to Experience the Future of Investing?
          </h3>
          <p className="text-[#A7B1C8] mb-8">
            Join 150,000+ investors building wealth with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/plans" className="btn-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
