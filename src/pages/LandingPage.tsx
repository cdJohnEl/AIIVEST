import HeroSection from '../sections/HeroSection';
import OverviewSection from '../sections/OverviewSection';
import MarketPulseSection from '../sections/MarketPulseSection';
import StrategySection from '../sections/StrategySection';
import DashboardPreviewSection from '../sections/DashboardPreviewSection';
import SecuritySection from '../sections/SecuritySection';
import PricingSection from '../sections/PricingSection';
import CTASection from '../sections/CTASection';

export default function LandingPage() {
  return (
    <main className="relative">
      <HeroSection />
      <OverviewSection />
      <MarketPulseSection />
      <StrategySection />
      <DashboardPreviewSection />
      <SecuritySection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
