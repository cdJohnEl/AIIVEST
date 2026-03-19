import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active Affiliates', value: '500+' },
  { label: 'Total Commissions Paid', value: '$1.2M+' },
  { label: 'Average Monthly Earnings', value: '$2,400' },
  { label: 'Conversion Rate', value: '12.5%' },
];

const tiers = [
  {
    name: 'Starter',
    range: '0 - 10 Referrals',
    commission: '10%',
    benefits: ['Basic marketing kit', 'Monthly payouts', 'Email support'],
  },
  {
    name: 'Pro',
    range: '11 - 50 Referrals',
    commission: '20%',
    benefits: ['Custom landers', 'Weekly payouts', 'Priority support', 'Personal account manager'],
    featured: true,
  },
  {
    name: 'Elite',
    range: '50+ Referrals',
    commission: '30%',
    benefits: ['Co-branded assets', 'Instant payouts', 'Exclusive events', 'Beta access to AI models'],
  },
];

export default function AffiliateProgram() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-[#10B981]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            AIVEST <span className="text-[#10B981]">Affiliate Program</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Partner with the world's most advanced AI investment platform. 
            Refer users and earn recurring commissions for life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/register">
              <Button size="lg" className="bg-[#10B981] hover:bg-[#059669] text-white px-8 h-12 rounded-xl text-lg font-semibold">
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 text-white px-8 h-12 rounded-xl">
              Download Media Kit
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-[#10B981] mb-1">{stat.value}</div>
              <div className="text-sm text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[#F4F6FF] text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Join', text: 'Apply for free and get access to your unique affiliate links and marketing materials.' },
              { icon: TrendingUp, title: 'Promote', text: 'Share your links via social media, blogs, or newsletters and track your performance in real-time.' },
              { icon: DollarSign, title: 'Earn', text: 'Receive recurring commissions on every investment made by your referred users.' },
            ].map((step, i) => (
              <div key={i} className="glass-card p-8 text-center relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-xl">
                  {i + 1}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F6FF] mb-3">{step.title}</h3>
                <p className="text-[#A7B1C8] leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Tier Commission */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[#F4F6FF] text-center mb-4">Commission Tiers</h2>
          <p className="text-[#A7B1C8] text-center mb-12">The more you refer, the more you earn.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.name} className={`glass-card p-8 relative overflow-hidden ${tier.featured ? 'border-[#10B981]/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : ''}`}>
                {tier.featured && (
                  <div className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#F4F6FF] mb-1">{tier.name}</h3>
                <p className="text-sm text-[#A7B1C8] mb-4">{tier.range}</p>
                <div className="text-4xl font-black text-[#10B981] mb-6">{tier.commission}</div>
                <ul className="space-y-4 mb-8">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-[#A7B1C8]">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button className={`w-full h-11 rounded-lg ${tier.featured ? 'bg-[#10B981] hover:bg-[#059669]' : 'bg-white/5 hover:bg-white/10'} text-white`}>
                    Join {tier.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="glass-card p-12 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#2D6BFF]/10 rounded-full blur-3xl"></div>
          <div className="relative text-center max-w-2xl mx-auto">
            <Zap className="w-12 h-12 text-[#10B981] mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-[#F4F6FF] mb-4">Ready to start earning?</h2>
            <p className="text-[#A7B1C8] mb-8">
              Join our affiliate family today and help us bring professional AI investing to everyone. 
              Our team manually reviews every application within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="bg-[#F4F6FF] text-[#070A12] hover:bg-white px-10 h-12 rounded-xl font-bold w-full">
                  Create Affiliate Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
