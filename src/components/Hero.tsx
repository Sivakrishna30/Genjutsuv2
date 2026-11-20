interface HeroProps {
  onStartPlaying?: () => void;
}

export function Hero({ onStartPlaying }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 text-center">
          Wake up to <span className="text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">Reality!</span>
        </h1>
        
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8 text-center">
          Play high-end games without a high-end gaming device.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button 
            id="hero-start-playing-btn"
            type="button"
            onClick={onStartPlaying}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-lg cursor-pointer shadow-lg shadow-white/10"
          >
            Start Playing
          </button>
          <a 
            id="hero-view-pricing-btn"
            href="/#pricing" 
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-lg inline-block text-center"
          >
            View Pricing
          </a>
        </div>
      </div>
    </section>
  );
}
