import { useEffect, useRef } from 'react';
import { Bot, Shield, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Bot,
    title: 'Automated Portfolio Building',
    description: 'Tell us your goals and risk comfort—our AI constructs a diversified portfolio in seconds.',
    image: '/images/overview_automation.jpg',
  },
  {
    icon: Shield,
    title: 'Real-Time Risk Guard',
    description: 'Markets shift. Our models monitor exposure continuously and rebalance before risks compound.',
    image: '/images/overview_risk.jpg',
  },
  {
    icon: RefreshCw,
    title: 'Smart Rebalancing',
    description: 'Tax-efficient, drift-aware adjustments that keep your strategy on track without the manual work.',
    image: '/images/overview_rebalance.jpg',
  },
];

export default function OverviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -40 },
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

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
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
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] text-center mb-16 opacity-0"
        >
          What AI Invest Pro does for you
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="glass-card p-6 lg:p-8 group hover:border-[#2D6BFF]/30 transition-all duration-500 opacity-0"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2D6BFF]/20 to-[#2D6BFF]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-[#2D6BFF]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#F4F6FF] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#A7B1C8] text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Image */}
              <div className="relative overflow-hidden rounded-xl aspect-video">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220]/60 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
