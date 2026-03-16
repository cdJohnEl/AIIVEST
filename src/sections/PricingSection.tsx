import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Sparkles,
    price: 'Free',
    period: '',
    description: 'Explore the platform. Build a plan. Simulate performance.',
    features: [
      'Portfolio simulator',
      'Basic AI insights',
      'Market data access',
      'Educational resources',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: Zap,
    price: '0.75%',
    period: '/ year',
    description: 'Full AI portfolio management, rebalancing, and tax optimization.',
    features: [
      'Everything in Starter',
      'AI-powered investing',
      'Automatic rebalancing',
      'Tax-loss harvesting',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Investing',
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    price: '0.50%',
    period: '/ year',
    description: 'Dedicated support, custom strategies, and advanced reporting.',
    features: [
      'Everything in Growth',
      'Dedicated advisor',
      'Custom strategies',
      'Advanced reporting',
      'VIP events access',
      'White-glove onboarding',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    note: 'Minimums apply',
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#0D1220]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 opacity-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-[#A7B1C8] text-lg max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready to invest.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`relative rounded-[22px] p-6 lg:p-8 transition-all duration-500 opacity-0 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-[#2D6BFF]/20 to-[#0D1220] border-2 border-[#2D6BFF]/50'
                  : 'glass-card'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#2D6BFF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  plan.highlighted ? 'bg-[#2D6BFF]' : 'bg-white/5'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.highlighted ? 'text-white' : 'text-[#2D6BFF]'}`} />
                </div>
                <h3 className="text-xl font-semibold text-[#F4F6FF] mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl lg:text-4xl font-bold text-[#F4F6FF]">{plan.price}</span>
                  <span className="text-[#A7B1C8]">{plan.period}</span>
                </div>
                <p className="text-sm text-[#A7B1C8] leading-relaxed">{plan.description}</p>
                {plan.note && (
                  <p className="text-xs text-[#A7B1C8] mt-2">{plan.note}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'bg-[#2D6BFF]/20' : 'bg-white/5'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.highlighted ? 'text-[#2D6BFF]' : 'text-[#10B981]'}`} />
                    </div>
                    <span className="text-sm text-[#A7B1C8]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.id === 'pro' ? '/contact' : '/register'}
                className={`block w-full text-center py-3 rounded-full font-medium transition-all duration-300 ${
                  plan.highlighted
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-[#A7B1C8] mt-12">
          All plans include bank-level security and 24/7 account access.{' '}
          <Link to="/faq" className="text-[#2D6BFF] hover:underline">
            Learn more
          </Link>
        </p>
      </div>
    </section>
  );
}
