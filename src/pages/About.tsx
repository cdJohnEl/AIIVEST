import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Globe, 
  Zap, 
  Users, 
  Lock,
  Heart,
  Target,
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Eye,
    title: 'Radical Transparency',
    description: 'Every fee, every trade, every decision—visible to you in real-time. No hidden costs, no fine print.',
  },
  {
    icon: Shield,
    title: 'Privacy by Design',
    description: 'Your financial data belongs to you alone. We employ military-grade encryption and offer anonymous payment options.',
  },
  {
    icon: Zap,
    title: 'AI-First Approach',
    description: 'Our algorithms process millions of data points per second, making decisions faster and more accurately than any human.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Built by investors, for investors. We listen to our community and evolve based on your feedback.',
  },
];

const differentiators = [
  {
    title: 'Zero-Knowledge Architecture',
    description: 'We can\'t see your private keys, and neither can anyone else. Your assets remain truly yours.',
    icon: Lock,
  },
  {
    title: 'Anonymous Onboarding',
    description: 'Start investing with just an email. No invasive KYC for crypto deposits under $10,000.',
    icon: Eye,
  },
  {
    title: 'Instant Withdrawals',
    description: '24/7 automated processing. Your money moves at the speed of blockchain, not banking hours.',
    icon: Zap,
  },
  {
    title: 'Global Access',
    description: 'Available in 180+ countries. No bank account? No problem. Crypto-only accounts welcome.',
    icon: Globe,
  },
];

const stats = [
  { value: '$2.4B+', label: 'Assets Under Management' },
  { value: '150K+', label: 'Active Investors' },
  { value: '94.7%', label: 'AI Prediction Accuracy' },
  { value: '0', label: 'Security Breaches' },
];

const testimonials = [
  {
    quote: "NexusFinPro changed how I think about wealth building. The privacy features mean I can invest without worrying about my data being sold.",
    author: "Marcus T.",
    role: "Software Engineer",
    location: "Berlin, Germany"
  },
  {
    quote: "Finally, a platform that understands crypto natives. Anonymous deposits, instant withdrawals, and AI that actually works.",
    author: "Sarah K.",
    role: "Crypto Trader",
    location: "Singapore"
  },
  {
    quote: "The returns speak for themselves. 28% APY on my portfolio while traditional banks offer 0.5%. It's a no-brainer.",
    author: "James L.",
    role: "Small Business Owner",
    location: "Austin, USA"
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: heroRef.current, start: 'top 80%' }}
      );
      gsap.fromTo(missionRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: missionRef.current, start: 'top 75%' }}
      );
      gsap.fromTo(valuesRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: valuesRef.current, start: 'top 75%' }}
      );
      gsap.fromTo(statsRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="mono-label text-[#2D6BFF] mb-4 block">About Us</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6 leading-tight">
            We're Building the <span className="text-gradient">Future of Wealth</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] leading-relaxed">
            NexusFinPro was born from a simple belief: everyone deserves access to 
            sophisticated investment tools, complete privacy, and the freedom to build 
            wealth on their own terms.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div ref={missionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="glass-card p-8 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D6BFF]/10 rounded-full blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#2D6BFF]/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#2D6BFF]" />
                </div>
                <span className="mono-label text-[#2D6BFF]">Our Mission</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF] mb-6">
                Democratize Wealth. Protect Privacy. Empower Individuals.
              </h2>
              <p className="text-[#A7B1C8] leading-relaxed mb-6">
                Traditional finance has failed the individual. Hidden fees, gatekept opportunities, 
                and surveillance capitalism have made building wealth harder than it should be. 
                We're here to change that.
              </p>
              <p className="text-[#A7B1C8] leading-relaxed">
                By combining cutting-edge AI with blockchain technology and a privacy-first ethos, 
                we're creating a platform where anyone, anywhere, can grow their wealth without 
                sacrificing their autonomy or anonymity.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/images/strategy_spotlight.jpg" 
                alt="Our Mission" 
                className="rounded-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-[#F4F6FF] font-semibold">Built with Purpose</p>
                    <p className="text-xs text-[#A7B1C8]">For the people, by the people</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#2D6BFF] mb-2">{stat.value}</div>
              <div className="text-sm text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div ref={valuesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="mono-label text-[#2D6BFF] mb-4 block">What We Stand For</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF]">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value) => (
            <div key={value.title} className="glass-card p-6 lg:p-8 group hover:border-[#2D6BFF]/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2D6BFF]/20 to-[#2D6BFF]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <value.icon className="w-7 h-7 text-[#2D6BFF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F4F6FF] mb-3">{value.title}</h3>
              <p className="text-[#A7B1C8] leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="mono-label text-[#2D6BFF] mb-4 block">Why Choose Us</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF]">What Makes Us Different</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {differentiators.map((item) => (
            <div key={item.title} className="flex items-start gap-4 glass-card-sm p-6">
              <div className="w-12 h-12 rounded-xl bg-[#2D6BFF]/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-[#2D6BFF]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">{item.title}</h3>
                <p className="text-[#A7B1C8] text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="mono-label text-[#2D6BFF] mb-4 block">Community Voices</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF]">What Our Users Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="w-4 h-4 text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#F4F6FF] leading-relaxed mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
                  <span className="text-white font-semibold">{testimonial.author[0]}</span>
                </div>
                <div>
                  <p className="text-[#F4F6FF] font-medium text-sm">{testimonial.author}</p>
                  <p className="text-[#A7B1C8] text-xs">{testimonial.role} • {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-[#F4F6FF] mb-2">Trusted & Verified</h3>
            <p className="text-[#A7B1C8]">Your security is our top priority</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'SOC 2 Type II', desc: 'Certified' },
              { icon: Lock, label: '256-bit', desc: 'Encryption' },
              { icon: CheckCircle2, label: 'Audited', desc: 'Smart Contracts' },
              { icon: Eye, label: 'Privacy', desc: 'By Design' },
            ].map((badge) => (
              <div key={badge.label} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <badge.icon className="w-7 h-7 text-[#2D6BFF]" />
                </div>
                <p className="text-[#F4F6FF] font-medium text-sm">{badge.label}</p>
                <p className="text-[#A7B1C8] text-xs">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D6BFF]/20 via-transparent to-[#2D6BFF]/20" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF] mb-4">
              Ready to Join the Revolution?
            </h2>
            <p className="text-[#A7B1C8] mb-8 max-w-xl mx-auto">
              Start building wealth with AI-powered insights, complete privacy, and the freedom 
              to invest on your terms. No banks. No borders. No compromises.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/plans" className="btn-secondary">
                Explore Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
