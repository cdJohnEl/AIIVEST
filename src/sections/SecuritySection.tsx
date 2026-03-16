import { useEffect, useRef } from 'react';
import { Lock, Eye, UserCheck, Server, FileCheck, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const securityFeatures = [
  {
    icon: Lock,
    title: 'Bank-level encryption',
    description: 'AES-256 encryption for data in transit and at rest. Your information is always protected.',
  },
  {
    icon: Eye,
    title: 'Transparent risk controls',
    description: 'Set guardrails. Get alerts. Stay in control of your investment parameters at all times.',
  },
  {
    icon: UserCheck,
    title: 'Your account, your ownership',
    description: 'You retain full ownership of holdings. We manage; we never obfuscate or lock your assets.',
  },
];

const complianceItems = [
  { icon: Server, label: 'SOC 2 Type II Certified' },
  { icon: FileCheck, label: 'FINRA Registered' },
  { icon: Globe, label: 'GDPR Compliant' },
];

export default function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: index * 0.15,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="security"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={contentRef} className="text-center mb-16 opacity-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4">
            Built to protect what matters.
          </h2>
          <p className="text-[#A7B1C8] text-lg max-w-xl mx-auto">
            Bank-grade security. Transparent risk controls. Your account, your ownership.
          </p>
        </div>

        {/* Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="glass-card p-6 lg:p-8 group hover:border-[#2D6BFF]/30 transition-all duration-500 opacity-0"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2D6BFF]/20 to-[#2D6BFF]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-[#2D6BFF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F4F6FF] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#A7B1C8] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Banner */}
        <div
          ref={bannerRef}
          className="relative rounded-[22px] overflow-hidden opacity-0"
        >
          <img
            src="/images/security_banner.jpg"
            alt="Security Infrastructure"
            className="w-full h-64 lg:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070A12]/90 via-[#070A12]/70 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-12">
            <p className="mono-label text-[#2D6BFF] mb-3">Enterprise Security</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] mb-4 max-w-md">
              Regulatory-ready infrastructure. Audited. Monitored. Resilient.
            </h3>
            
            <div className="flex flex-wrap gap-4">
              {complianceItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 glass-card-sm px-4 py-2"
                >
                  <item.icon className="w-4 h-4 text-[#10B981]" />
                  <span className="text-sm text-[#F4F6FF]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
