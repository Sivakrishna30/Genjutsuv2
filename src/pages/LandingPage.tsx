import { useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { FeaturedGames } from "../components/FeaturedGames";
import { WhyGenjutsu } from "../components/WhyGenjutsu";
import { PlatformCapabilities } from "../components/PlatformCapabilities";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";
import { SlotBookingModal } from "../components/SlotBookingModal";

export function LandingPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"1080p" | "1440p" | "4K">("1440p");
  const [selectedGameTitle, setSelectedGameTitle] = useState<string | undefined>(undefined);

  const handleStartPlaying = () => {
    setSelectedTier("1440p");
    setSelectedGameTitle(undefined);
    setIsBookingModalOpen(true);
  };

  const handlePlayGame = (gameTitle: string) => {
    setSelectedTier("1440p");
    setSelectedGameTitle(gameTitle);
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Header />
      <main>
        <Hero onStartPlaying={handleStartPlaying} />
        <FeaturedGames onPlayGame={handlePlayGame} />
        <WhyGenjutsu />
        <PlatformCapabilities />
        <Pricing />
        <FAQ />
      </main>
      <Footer />

      <SlotBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedGameTitle(undefined);
        }}
        initialTier={selectedTier}
        initialGameTitle={selectedGameTitle}
      />
    </>
  );
}
