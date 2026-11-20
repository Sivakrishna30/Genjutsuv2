import { useState } from "react";
import { Play, Sparkles, MonitorPlay } from "lucide-react";
import { SUPPORTED_GAMES, SupportedGame } from "../data/games";

interface FeaturedGamesProps {
  onPlayGame?: (gameTitle: string) => void;
}

export function FeaturedGames({ onPlayGame }: FeaturedGamesProps) {
  const [selectedLauncher, setSelectedLauncher] = useState<string>("All");

  const filteredGames = selectedLauncher === "All"
    ? SUPPORTED_GAMES
    : SUPPORTED_GAMES.filter((game) => game.launcher === selectedLauncher);

  const launchers = ["All", "Steam", "Epic Games", "Xbox"];

  return (
    <section id="games" className="py-24 border-t border-white/5 bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Verified Pre-Installed Rigs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Supported Games & Launchers
            </h2>
            <p className="text-white/60 text-sm mt-2 max-w-xl">
              Stream pre-installed AAA titles hosted directly on NVMe SSD cloud rigs across native Steam, Epic Games, and Xbox launchers.
            </p>
          </div>

          {/* Launcher Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
            {launchers.map((launcher) => (
              <button
                key={launcher}
                onClick={() => setSelectedLauncher(launcher)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedLauncher === launcher
                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {launcher === "All" ? `All Games (${SUPPORTED_GAMES.length})` : launcher}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game: SupportedGame) => (
            <div
              key={game.id}
              className="group relative bg-neutral-900 border border-white/10 hover:border-pink-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              {/* Game Thumbnail Cover */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                <img
                  src={game.image}
                  alt={game.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />

                {/* Launcher Badge (Top-Right) */}
                <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white shadow-md">
                  <img
                    src={game.launcherIcon}
                    alt={game.launcher}
                    referrerPolicy="no-referrer"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{game.launcher}</span>
                </div>

                {/* Performance Tag (Top-Left) */}
                <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
                  {game.resolution}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium text-pink-400 uppercase tracking-wider">
                      {game.genre}
                    </span>
                    <span className="text-[11px] text-white/40 font-mono">
                      {game.fps}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 mb-2">
                    {game.title}
                  </h3>

                  <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-6">
                    {game.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                    <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pre-Installed</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onPlayGame?.(game.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-semibold transition-all shadow-sm group-hover:shadow-pink-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
