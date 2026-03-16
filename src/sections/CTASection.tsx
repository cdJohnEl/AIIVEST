import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'API'],
  Company: ['About', 'Careers', 'Press', 'Partners'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Disclosures'],
  Support: ['Help Center', 'Contact', 'Status', 'Community'],
};

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-[#0D1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Card */}
        <div
          ref={ctaRef}
          className="glass-card p-8 lg:p-16 mb-16 opacity-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4 leading-tight">
                Ready to invest smarter?
              </h2>
              <p className="text-[#A7B1C8] text-lg leading-relaxed">
                Join thousands using AI to build long-term wealth—without the complexity.
                Start with as little as $100.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Start Investing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/plans" className="btn-secondary text-lg px-8 py-4">
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer ref={footerRef} className="opacity-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-[#F4F6FF] font-semibold text-lg">Invest Pro</span>
              </Link>
              <p className="text-[#A7B1C8] text-sm mb-6 max-w-xs">
                AI-powered investment platform for modern investors. Build wealth smarter with automated portfolios.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#A7B1C8]">
                  <Mail className="w-4 h-4" />
                  <span>support@aiinvestpro.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A7B1C8]">
                  <Phone className="w-4 h-4" />
                  <span>+1 (888) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A7B1C8]">
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
                    <li key={link}>
                      <Link
                        to={`/${link.toLowerCase().replace(' ', '-')}`}
                        className="text-sm text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#A7B1C8]">
              © 2024 AI Invest Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Risk disclaimer */}
          <div className="mt-8 p-4 glass-card-sm">
            <p className="text-xs text-[#A7B1C8] leading-relaxed">
              <strong className="text-[#F4F6FF]">Risk Disclaimer:</strong> Investing involves risk, including the possible loss of principal. 
              Past performance does not guarantee future results. AI Invest Pro provides investment advice through its automated platform. 
              Please consult with a qualified financial advisor before making investment decisions. 
              Cryptocurrency investments are highly volatile and may not be suitable for all investors.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
