import { MonitorX, Globe2, CloudDownload, Gamepad2 } from "lucide-react";

const features = [
  {
    icon: MonitorX,
    title: "No Gaming Hardware Required",
    description: "Experience high-performance gaming without having to buy expensive hardware."
  },
  {
    icon: CloudDownload,
    title: "Bring Your Own Game",
    description: "Connect your Steam, Epic Games, or Xbox accounts to play the games you already own."
  },
  {
    icon: Gamepad2,
    title: "Ready to Play Instantly",
    description: "Jump straight into our library of pre-installed, Heavy AAA games. No massive downloads or updates required."
  }
];

export function WhyGenjutsu() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Why Genjutsu</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-2xl bg-black border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
