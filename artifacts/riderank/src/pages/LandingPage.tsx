import { Hero, SpotFinder, SpotsSection, MapSection, RankingSection, Progression, FAQSection, AboutSection } from '../components/LandingSections';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <SpotFinder />
      <SpotsSection />
      <MapSection />
      <RankingSection />
      <Progression />
      <FAQSection />
      <AboutSection />
    </main>
  );
}
