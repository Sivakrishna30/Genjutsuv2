import { useState, useEffect, useRef, useCallback } from "react";
import {
  ControllerCustomization,
  InputLogEvent,
  PhysicalGamepadInfo,
  VMSessionMetrics,
  ControllerInputSource,
} from "../types/controller";
import {
  getActiveGamepads,
  isTouchDevice,
  formatLogTimestamp,
  triggerHapticFeedback,
  STANDARD_BUTTON_NAMES,
} from "../lib/gamepadManager";
import { VirtualGamepadOverlay } from "./VirtualGamepadOverlay";
import { KeyboardMouseOverlay } from "./KeyboardMouseOverlay";
import { InputDiagnosticsPanel } from "./InputDiagnosticsPanel";
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sliders,
  Tv,
  Cpu,
  RefreshCw,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import logoImg from "../assets/images/IMG_1281.jpeg";

interface VirtualMachineStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle?: string;
}

export function VirtualMachineStreamModal({
  isOpen,
  onClose,
  gameTitle = "Genjutsu Cloud Arena Rig",
}: VirtualMachineStreamModalProps) {
  // Session Metrics state
  const [metrics, setMetrics] = useState<VMSessionMetrics>({
    gpuModel: "NVIDIA GeForce RTX 4090",
    vramAllocated: "24 GB GDDR6X",
    cpuAllocated: "16 vCPU AMD EPYC 9654",
    ramAllocated: "64 GB DDR5",
    resolution: "4K",
    targetFps: 120,
    actualFps: 119.8,
    streamBitrateMbps: 48.6,
    decodeLatencyMs: 1.2,
    networkJitterMs: 0.4,
    packetLossPercent: 0.0,
    elapsedSeconds: 0,
  });

  // Controller Customization state
  const [customization, setCustomization] = useState<ControllerCustomization>({
    opacity: 85,
    size: "normal",
    theme: "xbox",
    position: "standard",
    hapticFeedback: true,
    showDiagnostics: true,
    forceMode: "auto",
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<"stream" | "logs">("stream");

  // Input & Controller Engine States
  const [physicalGamepads, setPhysicalGamepads] = useState<PhysicalGamepadInfo[]>([]);
  const [inputLogs, setInputLogs] = useState<InputLogEvent[]>([]);
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const streamContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastGamepadButtonsRef = useRef<Record<number, boolean[]>>({});

  // Determine active input source based on auto-detection or user forceMode
  const hasPhysical = physicalGamepads.length > 0;
  const isTouch = isTouchDevice();

  let activeSource: ControllerInputSource = "keyboard_mouse";
  if (customization.forceMode === "physical") {
    activeSource = "physical_gamepad";
  } else if (customization.forceMode === "touch") {
    activeSource = "touch_overlay";
  } else if (customization.forceMode === "keyboard") {
    activeSource = "keyboard_mouse";
  } else {
    // Auto mode
    if (hasPhysical) {
      activeSource = "physical_gamepad";
    } else if (isTouch) {
      activeSource = "touch_overlay";
    } else {
      activeSource = "keyboard_mouse";
    }
  }

  // Record input event helper
  const handleInputEvent = useCallback((event: InputLogEvent) => {
    setInputLogs((prev) => [event, ...prev.slice(0, 199)]);

    // Update active visual set
    if (event.actionType === "press" || event.actionType === "key_down") {
      setActiveButtons((prev) => new Set(prev).add(event.buttonName));
    } else if (event.actionType === "release" || event.actionType === "key_up") {
      setActiveButtons((prev) => {
        const next = new Set(prev);
        next.delete(event.buttonName);
        return next;
      });
    }
  }, []);

  // Timer for session duration
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
        actualFps: Number((prev.targetFps - Math.random() * 0.8).toFixed(1)),
        streamBitrateMbps: Number((48 + (Math.random() * 2 - 1)).toFixed(1)),
        decodeLatencyMs: Number((1.1 + Math.random() * 0.3).toFixed(1)),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Physical Gamepad Detection & Polling Loop
  useEffect(() => {
    if (!isOpen) return;

    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log("🎮 Gamepad Connected:", e.gamepad.id);
      setPhysicalGamepads(getActiveGamepads());
      handleInputEvent({
        id: `gp-connect-${Date.now()}`,
        timestamp: Date.now(),
        formattedTime: formatLogTimestamp(),
        source: "physical_gamepad",
        buttonName: "Controller Connected",
        actionType: "press",
        value: 1,
        responseTimeMs: 0.1,
        details: e.gamepad.id,
      });
      triggerHapticFeedback(40, e.gamepad.index);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log("🎮 Gamepad Disconnected:", e.gamepad.id);
      setPhysicalGamepads(getActiveGamepads());
      handleInputEvent({
        id: `gp-disconnect-${Date.now()}`,
        timestamp: Date.now(),
        formattedTime: formatLogTimestamp(),
        source: "physical_gamepad",
        buttonName: "Controller Disconnected",
        actionType: "release",
        value: 0,
        responseTimeMs: 0.1,
        details: e.gamepad.id,
      });
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    // Initial check
    setPhysicalGamepads(getActiveGamepads());

    // Gamepad High-Frequency Polling Loop (120Hz/60Hz)
    let pollId: number;
    const pollLoop = () => {
      if (typeof navigator !== "undefined" && navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
          const gp = gamepads[i];
          if (gp && gp.connected) {
            const lastButtons = lastGamepadButtonsRef.current[gp.index] || [];
            const currentButtons = gp.buttons.map((b) => b.pressed);

            gp.buttons.forEach((btn, btnIdx) => {
              const wasPressed = lastButtons[btnIdx] || false;
              if (btn.pressed && !wasPressed) {
                // Button Press Event
                const btnName =
                  STANDARD_BUTTON_NAMES[btnIdx]?.xbox || `Button ${btnIdx}`;
                handleInputEvent({
                  id: `gp-btn-${Date.now()}-${btnIdx}`,
                  timestamp: Date.now(),
                  formattedTime: formatLogTimestamp(),
                  source: "physical_gamepad",
                  buttonName: btnName,
                  actionType: "press",
                  value: btn.value,
                  responseTimeMs: Number((0.5 + Math.random() * 0.4).toFixed(2)),
                  details: `Gamepad #${gp.index} Index ${btnIdx}`,
                });
              } else if (!btn.pressed && wasPressed) {
                // Button Release Event
                const btnName =
                  STANDARD_BUTTON_NAMES[btnIdx]?.xbox || `Button ${btnIdx}`;
                handleInputEvent({
                  id: `gp-btn-rel-${Date.now()}-${btnIdx}`,
                  timestamp: Date.now(),
                  formattedTime: formatLogTimestamp(),
                  source: "physical_gamepad",
                  buttonName: btnName,
                  actionType: "release",
                  value: 0,
                  responseTimeMs: Number((0.5 + Math.random() * 0.3).toFixed(2)),
                  details: `Gamepad #${gp.index} Index ${btnIdx}`,
                });
              }
            });

            lastGamepadButtonsRef.current[gp.index] = currentButtons;
          }
        }
      }
      pollId = requestAnimationFrame(pollLoop);
    };

    pollId = requestAnimationFrame(pollLoop);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
      cancelAnimationFrame(pollId);
    };
  }, [isOpen, handleInputEvent]);

  // Keyboard & Mouse Listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const startTime = performance.now();
      setActiveKeys((prev) => new Set(prev).add(e.code).add(e.key.toLowerCase()));
      const endTime = performance.now();
      const responseTimeMs = Number((endTime - startTime + 0.5 + Math.random() * 0.5).toFixed(2));

      handleInputEvent({
        id: `kbm-down-${Date.now()}-${e.code}`,
        timestamp: Date.now(),
        formattedTime: formatLogTimestamp(),
        source: "keyboard_mouse",
        buttonName: `Key ${e.key.toUpperCase()} (${e.code})`,
        actionType: "key_down",
        value: 1,
        responseTimeMs,
        details: `Keycode: ${e.code}`,
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        next.delete(e.key.toLowerCase());
        return next;
      });

      handleInputEvent({
        id: `kbm-up-${Date.now()}-${e.code}`,
        timestamp: Date.now(),
        formattedTime: formatLogTimestamp(),
        source: "keyboard_mouse",
        buttonName: `Key ${e.key.toUpperCase()} (${e.code})`,
        actionType: "key_up",
        value: 0,
        responseTimeMs: Number((0.6 + Math.random() * 0.3).toFixed(2)),
        details: `Keycode: ${e.code}`,
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      const btnMap = ["MouseLeft", "MouseMiddle", "MouseRight"];
      const btnName = btnMap[e.button] || `MouseBtn${e.button}`;
      setActiveKeys((prev) => new Set(prev).add(btnName));

      handleInputEvent({
        id: `mouse-down-${Date.now()}-${e.button}`,
        timestamp: Date.now(),
        formattedTime: formatLogTimestamp(),
        source: "keyboard_mouse",
        buttonName: btnName === "MouseLeft" ? "Mouse 1 (Primary Attack)" : "Mouse 2 (Aim / Guard)",
        actionType: "press",
        value: 1,
        responseTimeMs: Number((0.8 + Math.random() * 0.4).toFixed(2)),
        details: `Button ${e.button} Clicked`,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      const btnMap = ["MouseLeft", "MouseMiddle", "MouseRight"];
      const btnName = btnMap[e.button] || `MouseBtn${e.button}`;
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(btnName);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen, handleInputEvent]);

  // Cyber Animated Canvas Stream Simulation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 450;

      const w = canvas.width;
      const h = canvas.height;

      // Dark background with gradient
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, "#08040d");
      bgGrad.addColorStop(0.5, "#000000");
      bgGrad.addColorStop(1, "#030c14");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Cyber Grid Horizon perspective
      ctx.strokeStyle = "rgba(236, 72, 153, 0.15)";
      ctx.lineWidth = 1;
      const horizon = h * 0.55;

      for (let x = -w; x < w * 2; x += 40) {
        ctx.beginPath();
        ctx.moveTo(w / 2, horizon);
        ctx.lineTo(x + (Math.sin(frame * 0.02) * 20), h);
        ctx.stroke();
      }

      for (let y = horizon; y < h; y += (y - horizon) * 0.3 + 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = "rgba(6, 182, 212, 0.18)";
        ctx.stroke();
      }

      // Center Cloud Kanji Watermark with glowing pulse
      ctx.save();
      ctx.translate(w / 2, horizon - 20);
      const pulse = Math.sin(frame * 0.04) * 0.1 + 0.9;
      ctx.scale(pulse, pulse);

      ctx.fillStyle = "rgba(236, 72, 153, 0.7)";
      ctx.font = "bold 56px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#ec4899";
      ctx.shadowBlur = 25;
      ctx.fillText("雲", 0, 0);

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "bold 14px monospace";
      ctx.shadowBlur = 0;
      ctx.fillText("GENJUTSU ULTRA-LOW LATENCY STREAM", 0, 48);
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  // Fullscreen toggle helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && streamContainerRef.current) {
      streamContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  const formatElapsed = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        ref={streamContainerRef}
        className="w-full max-w-7xl h-full max-h-[96vh] bg-neutral-950 border border-white/15 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* Top Cloud Gaming Title & Stream Telemetry Bar */}
        <div className="bg-neutral-900/90 border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 z-40">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Genjutsu Logo"
              className="w-8 h-8 object-contain mix-blend-screen"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base tracking-wide">
                  {gameTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                  Live Rig
                </span>
              </div>
              <p className="text-[11px] text-white/50 hidden sm:block">
                {metrics.gpuModel} • {metrics.resolution} @ {metrics.actualFps} FPS
              </p>
            </div>
          </div>

          {/* Quick Telemetry Chips */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-white/80">
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              <span>{formatElapsed(metrics.elapsedSeconds)}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>{metrics.decodeLatencyMs} ms</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-cyan-400">
              <Tv className="w-3.5 h-3.5" />
              <span>{metrics.streamBitrateMbps} Mbps</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Tab switch for mobile */}
            <div className="flex xl:hidden bg-white/5 rounded-xl p-1 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("stream")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "stream" ? "bg-pink-500 text-white" : "text-white/60"
                }`}
              >
                Stream
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "logs" ? "bg-pink-500 text-white" : "text-white/60"
                }`}
              >
                Input Logs ({inputLogs.length})
              </button>
            </div>

            {/* Customization Drawer Toggle */}
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className={`p-2 rounded-xl border transition-all ${
                showSettingsDrawer
                  ? "bg-pink-500 text-white border-pink-400"
                  : "bg-white/5 text-white/80 border-white/10 hover:border-pink-500/50"
              }`}
              title="Overlay Customization"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/80 transition-all"
              title={isMuted ? "Unmute Stream" : "Mute Stream"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/80 transition-all hidden sm:block"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-white/80 transition-all border border-white/10"
              title="Exit Session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Body: Stream Viewport + Split Diagnostics */}
        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
          {/* Main Streaming Canvas & Dynamic Controller HUD Viewport */}
          <div
            className={`relative flex-1 bg-black flex items-center justify-center overflow-hidden ${
              activeTab === "logs" ? "hidden xl:flex" : "flex"
            }`}
          >
            {/* Live Render Canvas */}
            <canvas ref={canvasRef} className="w-full h-full object-cover block" />

            {/* Interactive Controller HUD Overlay based on detected / forced mode */}
            {activeSource === "touch_overlay" ? (
              <VirtualGamepadOverlay
                customization={customization}
                onInputEvent={handleInputEvent}
                activeButtons={activeButtons}
              />
            ) : activeSource === "keyboard_mouse" ? (
              <KeyboardMouseOverlay
                customization={customization}
                activeKeys={activeKeys}
              />
            ) : (
              // Physical gamepad overlay notification
              <div className="absolute top-4 left-4 z-30 pointer-events-none bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-semibold backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Physical Gamepad Active: {physicalGamepads[0]?.id.slice(0, 24)}</span>
              </div>
            )}

            {/* Quick Mode Override Bar (Bottom Center) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 bg-neutral-950/80 border border-white/15 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 text-[11px]">
              <span className="text-white/40 uppercase font-mono">Input:</span>
              <span className="font-bold text-pink-400 capitalize">
                {activeSource === "physical_gamepad"
                  ? "Physical Controller"
                  : activeSource === "touch_overlay"
                  ? "Virtual Touch HUD"
                  : "Keyboard & Mouse"}
              </span>
            </div>
          </div>

          {/* Right Side: Live Input Diagnostics & Response Telemetry Panel */}
          <div
            className={`w-full xl:w-96 2xl:w-[420px] bg-neutral-950 p-4 border-t xl:border-t-0 xl:border-l border-white/10 flex-col overflow-y-auto ${
              activeTab === "logs" ? "flex" : "hidden xl:flex"
            }`}
          >
            <InputDiagnosticsPanel
              logs={inputLogs}
              activeSource={activeSource}
              physicalGamepads={physicalGamepads}
              onClearLogs={() => setInputLogs([])}
            />
          </div>

          {/* Slide-out Customization Drawer */}
          {showSettingsDrawer && (
            <div className="absolute top-0 right-0 bottom-0 w-full sm:w-80 bg-neutral-900/95 border-l border-white/15 p-6 z-50 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-pink-400" />
                    <h4 className="font-bold text-white text-base">Controller Settings</h4>
                  </div>
                  <button
                    onClick={() => setShowSettingsDrawer(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Input Mode Force Override */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Input Method
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                    {[
                      { id: "auto", label: "Auto-Detect" },
                      { id: "touch", label: "Touch HUD" },
                      { id: "keyboard", label: "Keyboard & Mouse" },
                      { id: "physical", label: "Physical Pad" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() =>
                          setCustomization((prev) => ({
                            ...prev,
                            forceMode: mode.id as ControllerCustomization["forceMode"],
                          }))
                        }
                        className={`p-2 rounded-xl border transition-all text-center ${
                          customization.forceMode === mode.id
                            ? "bg-pink-500 text-white border-pink-400 font-bold"
                            : "bg-white/5 text-white/70 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity Slider */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    <span>HUD Opacity</span>
                    <span className="font-mono text-pink-400">{customization.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={customization.opacity}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        opacity: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Sizing Scale */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Button Sizing
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                    {(["compact", "normal", "large"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() =>
                          setCustomization((prev) => ({ ...prev, size: s }))
                        }
                        className={`py-1.5 rounded-xl border capitalize transition-all ${
                          customization.size === s
                            ? "bg-pink-500 text-white border-pink-400 font-bold"
                            : "bg-white/5 text-white/70 border-white/10"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Glyphs */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Button Glyphs
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                    {[
                      { id: "xbox", label: "Xbox (ABXY)" },
                      { id: "playstation", label: "PlayStation" },
                      { id: "neon", label: "Neon" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          setCustomization((prev) => ({
                            ...prev,
                            theme: t.id as ControllerCustomization["theme"],
                          }))
                        }
                        className={`py-1.5 rounded-xl border text-[11px] transition-all ${
                          customization.theme === t.id
                            ? "bg-pink-500 text-white border-pink-400 font-bold"
                            : "bg-white/5 text-white/70 border-white/10"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Haptics Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs">
                    <div className="font-semibold text-white">Haptic Vibration</div>
                    <div className="text-white/50 text-[11px]">Vibrate on touch press</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={customization.hapticFeedback}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        hapticFeedback: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowSettingsDrawer(false)}
                  className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-pink-500/20"
                >
                  Apply & Return to Stream
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
