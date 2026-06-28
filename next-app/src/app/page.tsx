import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import Problem from '@/components/Problem';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Setup from '@/components/Setup';
import StaticDemo from '@/components/StaticDemo';
import InteractiveDemo from '@/components/InteractiveDemo';
import TrustSection from '@/components/TrustSection';
import Testimonials from '@/components/Testimonials';
import PricingSection from '@/components/PricingSection';
import FAQ from '@/components/FAQ';
import BottomCTA from '@/components/BottomCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Problem />
      <HowItWorks />
      <Features />
      <Setup />
      <StaticDemo />
      <InteractiveDemo />
      <TrustSection />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <BottomCTA />
    </>
  );
}
