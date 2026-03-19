import { 
  Handshake, 
  Building2, 
  Shield, 
  Zap, 
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const partnerTypes = [
  {
    icon: Building2,
    title: 'Institutional Partners',
    description: 'Banks, hedge funds, and financial institutions looking to offer AI-powered investment solutions.',
    benefits: ['White-label solutions', 'API integration', 'Custom strategies', 'Dedicated support'],
  },
  {
    icon: Shield,
    title: 'Technology Partners',
    description: 'Security firms, custody providers, and infrastructure companies enhancing our platform.',
    benefits: ['Technical integration', 'Co-marketing opportunities', 'Joint development', 'Revenue sharing'],
  },
  {
    icon: Zap,
    title: 'Affiliate Partners',
    description: 'Content creators, influencers, and marketers who want to earn by referring users.',
    benefits: ['Up to 30% commission', 'Real-time tracking', 'Marketing materials', 'Monthly payouts'],
  },
  {
    icon: Globe,
    title: 'Regional Partners',
    description: 'Local businesses and organizations helping us expand into new markets.',
    benefits: ['Exclusive territory rights', 'Local language support', 'Regional marketing', 'Revenue share'],
  },
];

import { Badge } from '@/components/ui/badge';

const currentPartners = [
  { name: 'Fireblocks', category: 'Custody', logo: 'F', status: 'Platinum' },
  { name: 'Chainalysis', category: 'Compliance', logo: 'C', status: 'Verified' },
  { name: 'CoinGecko', category: 'Data', logo: 'G', status: 'Verified' },
  { name: 'Alchemy', category: 'Infrastructure', logo: 'A', status: 'Platinum' },
  { name: 'Ledger', category: 'Security', logo: 'L', status: 'Verified' },
  { name: 'Messari', category: 'Research', logo: 'M', status: 'Verified' },
];

const stats = [
  { value: '$50M+', label: 'Partner Revenue Generated' },
  { value: '500+', label: 'Active Affiliates' },
  { value: '25+', label: 'Technology Partners' },
  { value: '40+', label: 'Countries Covered' },
];

export default function Partners() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Handshake className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            Partner With <span className="text-gradient">Us</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Join our ecosystem of partners and help shape the future of AI-powered investing. 
            Together, we can democratize wealth management worldwide.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-[#2D6BFF] mb-1">{stat.value}</div>
              <div className="text-sm text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Partner Types */}
        <div className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] text-center mb-8">
            Partnership Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTypes.map((type) => (
              <div key={type.title} className="glass-card p-6 hover:border-[#2D6BFF]/30 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2D6BFF]/10 flex items-center justify-center">
                    <type.icon className="w-6 h-6 text-[#2D6BFF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">{type.title}</h3>
                    <p className="text-[#A7B1C8] text-sm">{type.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-16">
                  {type.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-[#A7B1C8]">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Current Partners */}
        <div className="glass-card p-8 mb-16">
          <h2 className="text-2xl font-bold text-[#F4F6FF] text-center mb-8">
            Our Partners
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {currentPartners.map((partner) => (
              <div key={partner.name} className="text-center">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 relative group">
                  <span className="text-2xl font-bold text-[#2D6BFF]">{partner.logo}</span>
                  <div className="absolute -top-2 -right-2">
                    <Badge className={`text-[8px] px-1 h-4 ${
                      partner.status === 'Platinum' 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                        : 'bg-[#2D6BFF]'
                    }`}>
                      {partner.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-[#F4F6FF] font-medium text-sm">{partner.name}</p>
                <p className="text-xs text-[#A7B1C8]">{partner.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate Program */}
        <div className="glass-card p-8 mb-16 border-l-4 border-[#10B981]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
                <span className="text-[#10B981] font-medium">Affiliate Program</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F4F6FF] mb-2">
                Earn Up to 30% Commission
              </h3>
              <p className="text-[#A7B1C8]">
                Refer users to AI Invest Pro and earn recurring commissions on their investments.
              </p>
            </div>
            <Link to="/affiliate-program">
              <Button className="btn-primary">
                Become an Affiliate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-8 text-center">
          <Mail className="w-10 h-10 text-[#2D6BFF] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F4F6FF] mb-2">
            Interested in Partnering?
          </h3>
          <p className="text-[#A7B1C8] mb-4">
            Reach out to our partnerships team to discuss opportunities.
          </p>
          <a 
            href="mailto:partnerships@aiinvestpro.com" 
            className="text-[#2D6BFF] hover:underline text-lg"
          >
            partnerships@aiinvestpro.com
          </a>
        </div>
      </div>
    </div>
  );
}
