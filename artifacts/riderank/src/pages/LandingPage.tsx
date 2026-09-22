import { Hero, ShareStats, LeaderboardSection, Progression, FAQSection } from '../components/LandingSections';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <ShareStats />
      <LeaderboardSection />
      <Progression />
      <FAQSection />
    </main>
  );
}
