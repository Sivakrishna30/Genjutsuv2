import { ControllerCustomization } from "../types/controller";

interface KeyboardMouseOverlayProps {
  customization: ControllerCustomization;
  activeKeys: Set<string>;
}

export function KeyboardMouseOverlay({ customization, activeKeys }: KeyboardMouseOverlayProps) {
  const isKeyActive = (key: string) => activeKeys.has(key.toLowerCase()) || activeKeys.has(key.toUpperCase());

  return (
    <div
      className="absolute inset-x-0 bottom-4 pointer-events-none flex items-end justify-between px-4 sm:px-8 py-2 transition-opacity duration-200 z-30"
      style={{ opacity: customization.opacity / 100 }}
    >
      {/* Left side: WASD Movement & Modifiers HUD */}
      <div className="flex flex-col gap-2 pointer-events-auto bg-neutral-950/85 border border-white/15 p-3 rounded-2xl backdrop-blur-md shadow-xl">
        <div className="text-[10px] uppercase font-mono tracking-wider text-pink-400 font-semibold mb-1 flex items-center justify-between">
          <span>PC Movement HUD</span>
          <span className="text-white/40">60Hz Polling</span>
        </div>

        {/* WASD Cluster */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-9 h-9 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all ${
              isKeyActive("KeyW") || isKeyActive("w")
                ? "bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/50 scale-95"
                : "bg-neutral-900/90 text-white/80 border-white/20"
            }`}
          >
            W
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-9 h-9 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                isKeyActive("KeyA") || isKeyActive("a")
                  ? "bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/50 scale-95"
                  : "bg-neutral-900/90 text-white/80 border-white/20"
              }`}
            >
              A
            </div>
            <div
              className={`w-9 h-9 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                isKeyActive("KeyS") || isKeyActive("s")
                  ? "bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/50 scale-95"
                  : "bg-neutral-900/90 text-white/80 border-white/20"
              }`}
            >
              S
            </div>
            <div
              className={`w-9 h-9 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                isKeyActive("KeyD") || isKeyActive("d")
                  ? "bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/50 scale-95"
                  : "bg-neutral-900/90 text-white/80 border-white/20"
              }`}
            >
              D
            </div>
          </div>
        </div>

        {/* Space & Shift Row */}
        <div className="flex items-center gap-1.5 mt-1">
          <div
            className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-[11px] flex-1 text-center transition-all ${
              isKeyActive("ShiftLeft") || isKeyActive("Shift")
                ? "bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/40"
                : "bg-neutral-900/90 text-white/70 border-white/20"
            }`}
          >
            SHIFT
          </div>
          <div
            className={`px-6 py-1.5 rounded-lg border font-mono font-bold text-[11px] flex-[2] text-center transition-all ${
              isKeyActive("Space") || isKeyActive(" ")
                ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/40"
                : "bg-neutral-900/90 text-white/70 border-white/20"
            }`}
          >
            SPACE (JUMP)
          </div>
        </div>
      </div>

      {/* Right side: Action Keys & Mouse Aim HUD */}
      <div className="flex items-end gap-3 pointer-events-auto">
        {/* Action Hotkeys */}
        <div className="bg-neutral-950/85 border border-white/15 p-3 rounded-2xl backdrop-blur-md shadow-xl flex flex-col gap-1.5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-0.5">
            Actions
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {["Q", "E", "R", "F", "C", "Tab"].map((key) => {
              const active = isKeyActive(`Key${key}`) || isKeyActive(key);
              return (
                <div
                  key={key}
                  className={`w-8 h-8 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                    active
                      ? "bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/50 scale-95"
                      : "bg-neutral-900/90 text-white/80 border-white/20"
                  }`}
                >
                  {key}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mouse Primary & Secondary Clicks HUD */}
        <div className="bg-neutral-950/85 border border-white/15 p-3 rounded-2xl backdrop-blur-md shadow-xl flex flex-col items-center">
          <div className="text-[10px] uppercase font-mono tracking-wider text-pink-400 font-semibold mb-2">
            Mouse Aim
          </div>

          <div className="relative w-16 h-24 border-2 border-white/30 rounded-t-full rounded-b-2xl bg-neutral-900 flex flex-col overflow-hidden">
            <div className="flex h-10 border-b border-white/20">
              {/* Left Click */}
              <div
                className={`flex-1 border-r border-white/20 flex items-center justify-center font-mono text-[9px] font-bold ${
                  isKeyActive("MouseLeft")
                    ? "bg-pink-500 text-white shadow-inner"
                    : "bg-neutral-800/80 text-white/70"
                }`}
              >
                M1
              </div>
              {/* Right Click */}
              <div
                className={`flex-1 flex items-center justify-center font-mono text-[9px] font-bold ${
                  isKeyActive("MouseRight")
                    ? "bg-cyan-500 text-white shadow-inner"
                    : "bg-neutral-800/80 text-white/70"
                }`}
              >
                M2
              </div>
            </div>
            {/* Scroll Wheel Indicator */}
            <div className="flex-1 flex items-center justify-center">
              <div
                className={`w-2.5 h-5 rounded-full border border-white/30 ${
                  isKeyActive("MouseMiddle") ? "bg-amber-400" : "bg-neutral-700"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
