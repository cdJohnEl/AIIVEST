import { useEffect, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  FileCheck, 
  Fingerprint,
  Key,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const securityLayers = [
  {
    icon: Lock,
    title: 'Encryption at Rest & In Transit',
    description: 'All data is protected with AES-256 encryption, the same standard used by banks and military organizations.',
    badge: 'Bank-Grade'
  },
  {
    icon: Key,
    title: 'Multi-Signature Wallets',
    description: 'Your crypto assets are stored in multi-sig wallets requiring multiple approvals for any withdrawal.',
    badge: 'Institutional'
  },
  {
    icon: Server,
    title: 'Cold Storage',
    description: '95% of digital assets are kept in offline cold storage, isolated from internet-connected systems.',
    badge: 'Maximum Security'
  },
  {
    icon: Fingerprint,
    title: 'Biometric Authentication',
    description: 'Optional biometric verification adds an extra layer of protection to your account.',
    badge: 'Advanced'
  },
];

const certifications = [
  { name: 'SOC 2 Type II', description: 'Certified for security, availability, and confidentiality' },
  { name: 'ISO 27001', description: 'International standard for information security management' },
  { name: 'GDPR Compliant', description: 'Full compliance with EU data protection regulations' },
  { name: 'Regular Audits', description: 'Quarterly security audits by third-party firms' },
];

const privacyFeatures = [
  'No KYC required for crypto deposits under $10,000',
  'Anonymous account options available',
  'No selling of personal data to third parties',
  'Right to data deletion anytime',
  'Transparent data handling policies',
  'Privacy coin support (Monero, Zcash)',
];

export default function Security() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.security-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
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
          <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-[#10B981]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            Security <span className="text-gradient">First</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Your security is our top priority. We employ multiple layers of protection 
            to keep your assets and data safe.
          </p>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '0', label: 'Security Breaches' },
            { value: '$2.4B+', label: 'Assets Protected' },
            { value: '99.99%', label: 'Uptime' },
            { value: '24/7', label: 'Monitoring' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-[#10B981] mb-1">{stat.value}</div>
              <div className="text-sm text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Security Layers */}
        <div className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] text-center mb-8">
            Multi-Layer Security Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityLayers.map((layer) => (
              <div key={layer.title} className="security-card glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2D6BFF]/10 flex items-center justify-center flex-shrink-0">
                    <layer.icon className="w-6 h-6 text-[#2D6BFF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-[#F4F6FF]">{layer.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                        {layer.badge}
                      </span>
                    </div>
                    <p className="text-[#A7B1C8] text-sm leading-relaxed">{layer.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="glass-card p-8 mb-16">
          <h2 className="text-2xl font-bold text-[#F4F6FF] text-center mb-8">
            Certifications & Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#2D6BFF]/10 flex items-center justify-center mx-auto mb-3">
                  <FileCheck className="w-7 h-7 text-[#2D6BFF]" />
                </div>
                <h4 className="text-[#F4F6FF] font-medium mb-1">{cert.name}</h4>
                <p className="text-xs text-[#A7B1C8]">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="glass-card p-8 mb-16 border-l-4 border-[#10B981]">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#F4F6FF] mb-2">Privacy by Design</h2>
              <p className="text-[#A7B1C8]">
                We believe your financial data belongs to you alone. Our platform is built 
                with privacy at its core.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {privacyFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm text-[#A7B1C8]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bug Bounty */}
        <div className="glass-card-sm p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">Bug Bounty Program</h3>
            <p className="text-sm text-[#A7B1C8] mb-3">
              We reward security researchers who help us identify vulnerabilities. 
              Rewards up to $50,000 for critical findings.
            </p>
            <a href="mailto:security@nexusfinpro.com" className="text-[#2D6BFF] text-sm hover:underline">
              Report a vulnerability →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
