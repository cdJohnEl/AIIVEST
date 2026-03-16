import { Shield, Eye, Lock, Server, Globe } from 'lucide-react';

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      'Account information (email, username)',
      'Transaction data (deposits, withdrawals, investments)',
      'Device and browser information',
      'IP address and location data',
      'Usage analytics and preferences',
    ],
  },
  {
    icon: Lock,
    title: 'How We Protect Your Data',
    content: [
      'AES-256 encryption for all data at rest and in transit',
      'Multi-signature wallets for crypto assets',
      'Regular security audits by third-party firms',
      'Strict access controls and authentication',
      'Cold storage for 95% of digital assets',
    ],
  },
  {
    icon: Server,
    title: 'Data Storage & Retention',
    content: [
      'Data stored on secure, encrypted servers',
      'Retention only as long as necessary',
      'Right to deletion upon account closure',
      'Anonymous options available for crypto users',
      'No selling of personal data to third parties',
    ],
  },
  {
    icon: Globe,
    title: 'Your Rights',
    content: [
      'Access your personal data anytime',
      'Request correction of inaccurate data',
      'Request deletion of your data',
      'Opt-out of marketing communications',
      'Export your data in standard formats',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F6FF] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#A7B1C8]">
            Last updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <div className="glass-card p-6 mb-8">
          <p className="text-[#A7B1C8] leading-relaxed">
            At AI Invest Pro, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, store, and protect your personal information. By using our platform, you agree to the 
            practices described in this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section) => (
            <div key={section.title} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="w-6 h-6 text-[#2D6BFF]" />
                <h2 className="text-xl font-semibold text-[#F4F6FF]">{section.title}</h2>
              </div>
              <ul className="space-y-2 ml-9">
                {section.content.map((item) => (
                  <li key={item} className="text-[#A7B1C8] flex items-start gap-2">
                    <span className="text-[#2D6BFF] mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Anonymous Accounts */}
        <div className="glass-card p-6 mb-8 border-l-4 border-[#10B981]">
          <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">
            Anonymous Accounts
          </h2>
          <p className="text-[#A7B1C8] leading-relaxed mb-4">
            We support anonymous investing for crypto deposits under $10,000. For these accounts:
          </p>
          <ul className="space-y-2 text-[#A7B1C8]">
            <li>• Only an email address is required</li>
            <li>• No KYC or identity verification needed</li>
            <li>• Privacy coin deposits supported (Monero, Zcash)</li>
            <li>• No linking to traditional banking information</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="glass-card p-6 text-center">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-2">
            Questions About Privacy?
          </h2>
          <p className="text-[#A7B1C8] mb-4">
            Contact our Data Protection Officer for any privacy-related inquiries.
          </p>
          <a 
            href="mailto:privacy@aiinvestpro.com" 
            className="text-[#2D6BFF] hover:underline"
          >
            privacy@aiinvestpro.com
          </a>
        </div>
      </div>
    </div>
  );
}
