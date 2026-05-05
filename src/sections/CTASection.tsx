import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Mail, MapPin, Phone } from 'lucide-react';
import { SecurityBadges } from '../components/TrustSignals';

const footerLinks = {
  Product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/plans' },
    { name: 'Security', href: '/security' },
    { name: 'API', href: '/api' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
  ],
  Legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Disclosures', href: '/disclosures' },
  ],
  Support: [
    { name: 'Help Center', href: '/help-center' },
    { name: 'Contact', href: '/contact' },
    { name: 'Status', href: '/status' },
    { name: 'Community', href: '/community' },
  ],
};

export default function CTASection() {
  return (
    <section className="relative pt-24 pb-8 bg-[#070A12]">
      {/* CTA Card */}
      <div className="section-padding mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="pro-card p-8 lg:p-12 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D6BFF]/10 via-transparent to-[#8B5CF6]/10" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF] mb-4">
                  Ready to Invest Smarter?
                </h2>
                <p className="text-[#8B95A8] mb-6 max-w-lg">
                  Join 150,000+ investors using AI to build long-term wealth—without the complexity. 
                  Start with as little as $100.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link to="/register" className="btn-primary flex items-center gap-2 text-base">
                    Start Building Wealth
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/plans" className="btn-secondary">
                    View Plans
                  </Link>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-2xl font-bold text-[#F4F6FF] mb-1">$2.4B+</div>
                  <div className="text-xs text-[#5A6578]">Assets Protected</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-2xl font-bold text-[#F4F6FF] mb-1">150K+</div>
                  <div className="text-xs text-[#5A6578]">Active Investors</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-2xl font-bold text-[#F4F6FF] mb-1">94.7%</div>
                  <div className="text-xs text-[#5A6578]">AI Accuracy</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-2xl font-bold text-[#F4F6FF] mb-1">0</div>
                  <div className="text-xs text-[#5A6578]">Security Breaches</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="section-padding border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 py-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#F4F6FF] font-semibold">NexusFinPro</span>
              </Link>
              <p className="text-sm text-[#8B95A8] mb-6 max-w-xs">
                AI-powered investment platform for modern investors. Build wealth smarter with automated portfolios.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8B95A8]">
                  <Mail className="w-4 h-4" />
                  <span>support@nexusfinpro.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8B95A8]">
                  <Phone className="w-4 h-4" />
                  <span>+1 (888) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8B95A8]">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-[#F4F6FF] font-semibold mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-[#8B95A8] hover:text-[#F4F6FF] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Security Badges */}
          <div className="py-6 border-t border-white/[0.06]">
            <SecurityBadges />
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#5A6578]">
              © 2024 NexusFinPro. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-[#5A6578] hover:text-[#F4F6FF] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-[#5A6578] hover:text-[#F4F6FF] transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-[#5A6578] hover:text-[#F4F6FF] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="pro-card p-4 mb-6 border-l-2 border-[#F59E0B]">
            <p className="text-xs text-[#8B95A8] leading-relaxed">
              <span className="text-[#F4F6FF] font-medium">Risk Disclaimer:</span> All investments carry risk, 
              including the possible loss of principal. Past performance does not guarantee future results. 
              Please invest responsibly and only what you can afford to lose. Cryptocurrency investments 
              are highly volatile and may not be suitable for all investors.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
