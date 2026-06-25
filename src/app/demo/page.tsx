import InteractiveDemo from '@/components/InteractiveDemo';
import StaticDemo from '@/components/StaticDemo';
import BottomCTA from '@/components/BottomCTA';

export default function DemoPage() {
  return (
    <>
      <div className="pt-32" />
      <InteractiveDemo />
      <StaticDemo />
      <BottomCTA />
    </>
  );
}
