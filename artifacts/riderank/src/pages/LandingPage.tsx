import { Hero, ShareStats, SpotFinder, SpotsSection, MapSection, LeaderboardSection, Progression, FAQSection } from '../components/LandingSections';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <ShareStats />
      <SpotFinder />
      <SpotsSection />
      <MapSection />
      <LeaderboardSection />
      <Progression />
      <FAQSection />
    </main>
  );
}
