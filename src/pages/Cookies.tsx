import { Cookie, Settings, Eye, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const cookieTypes = [
  {
    name: 'Essential Cookies',
    description: 'Required for the platform to function properly. Cannot be disabled.',
    examples: ['Session management', 'Security tokens', 'Login state'],
    required: true,
  },
  {
    name: 'Analytics Cookies',
    description: 'Help us understand how users interact with our platform.',
    examples: ['Page views', 'Feature usage', 'Error tracking'],
    required: false,
  },
  {
    name: 'Preference Cookies',
    description: 'Remember your settings and preferences.',
    examples: ['Language selection', 'Theme preferences', 'Dashboard layout'],
    required: false,
  },
  {
    name: 'Marketing Cookies',
    description: 'Used to deliver relevant advertisements and track campaign performance.',
    examples: ['Ad personalization', 'Campaign analytics', 'Retargeting'],
    required: false,
  },
];

export default function Cookies() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F6FF] mb-4">
            Cookie Policy
          </h1>
          <p className="text-[#A7B1C8]">
            Last updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <div className="glass-card p-6 mb-8">
          <p className="text-[#A7B1C8] leading-relaxed">
            This Cookie Policy explains how NexusFinPro uses cookies and similar technologies 
            to recognize you when you visit our platform. It explains what these technologies are 
            and why we use them, as well as your rights to control our use of them.
          </p>
        </div>

        {/* What Are Cookies */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-[#2D6BFF]" />
            <h2 className="text-xl font-semibold text-[#F4F6FF]">What Are Cookies?</h2>
          </div>
          <p className="text-[#A7B1C8] leading-relaxed">
            Cookies are small data files that are placed on your computer or mobile device when you 
            visit a website. They are widely used to make websites work more efficiently and provide 
            information to the website owners.
          </p>
        </div>

        {/* Cookie Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#F4F6FF] mb-6">Types of Cookies We Use</h2>
          <div className="space-y-4">
            {cookieTypes.map((type) => (
              <div key={type.name} className="glass-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#F4F6FF]">{type.name}</h3>
                  {type.required ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">
                      Required
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981]">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-[#A7B1C8] mb-3">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example) => (
                    <span key={example} className="text-xs px-2 py-1 rounded bg-white/5 text-[#A7B1C8]">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Third Party Cookies */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#2D6BFF]" />
            <h2 className="text-xl font-semibold text-[#F4F6FF]">Third-Party Cookies</h2>
          </div>
          <p className="text-[#A7B1C8] leading-relaxed mb-4">
            We may allow third-party service providers to place cookies on your device for the 
            following purposes:
          </p>
          <ul className="space-y-2 text-[#A7B1C8]">
            <li>• Analytics services (Google Analytics)</li>
            <li>• Security and fraud prevention</li>
            <li>• Customer support tools</li>
            <li>• Marketing and advertising partners</li>
          </ul>
        </div>

        {/* Cookie Management */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-[#2D6BFF]" />
            <h2 className="text-xl font-semibold text-[#F4F6FF]">Managing Cookies</h2>
          </div>
          <p className="text-[#A7B1C8] leading-relaxed mb-4">
            You can control and manage cookies in various ways:
          </p>
          <ul className="space-y-2 text-[#A7B1C8]">
            <li>• Browser settings to block or delete cookies</li>
            <li>• Our cookie preference center (below)</li>
            <li>• Third-party opt-out tools</li>
          </ul>
        </div>

        {/* Cookie Preferences */}
        <div className="glass-card p-6 text-center">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-4">
            Cookie Preferences
          </h2>
          <p className="text-[#A7B1C8] mb-6">
            Manage your cookie settings at any time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="btn-primary">
              Accept All Cookies
            </Button>
            <Button variant="outline" className="border-white/10 text-[#F4F6FF]">
              Customize Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
