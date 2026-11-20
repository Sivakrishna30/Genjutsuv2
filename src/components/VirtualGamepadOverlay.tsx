import React, { useRef, useState, useEffect, useCallback } from "react";
import { ControllerCustomization, InputLogEvent } from "../types/controller";
import { triggerHapticFeedback, formatLogTimestamp } from "../lib/gamepadManager";

interface VirtualGamepadOverlayProps {
  customization: ControllerCustomization;
  onInputEvent: (event: InputLogEvent) => void;
  activeButtons: Set<string>;
}

export function VirtualGamepadOverlay({
  customization,
  onInputEvent,
  activeButtons,
}: VirtualGamepadOverlayProps) {
  const leftStickRef = useRef<HTMLDivElement>(null);
  const rightStickRef = useRef<HTMLDivElement>(null);

  const [leftStickPos, setLeftStickPos] = useState({ x: 0, y: 0 });
  const [rightStickPos, setRightStickPos] = useState({ x: 0, y: 0 });

  const isDraggingLeft = useRef<boolean>(false);
  const isDraggingRight = useRef<boolean>(false);
  const leftTouchId = useRef<number | null>(null);
  const rightTouchId = useRef<number | null>(null);

  // Button labels based on theme
  const getButtonLabel = (key: "A" | "B" | "X" | "Y") => {
    if (customization.theme === "playstation") {
      switch (key) {
        case "A": return "✕";
        case "B": return "◯";
        case "X": return "▢";
        case "Y": return "△";
      }
    }
    if (customization.theme === "neon") {
      switch (key) {
        case "A": return "1";
        case "B": return "2";
        case "X": return "3";
        case "Y": return "4";
      }
    }
    return key;
  };

  const getBumperLabel = (side: "L" | "R", tier: "1" | "2") => {
    if (customization.theme === "playstation") {
      return `${side}${tier}`;
    }
    return side === "L" ? (tier === "1" ? "LB" : "LT") : (tier === "1" ? "RB" : "RT");
  };

  // Helper to dispatch input event with response latency calculation
  const dispatchButton = useCallback(
    (name: string, actionType: "press" | "release", val = 1) => {
      const startTime = performance.now();
      if (actionType === "press" && customization.hapticFeedback) {
        triggerHapticFeedback(15);
      }
      const endTime = performance.now();
      const responseTimeMs = Number((endTime - startTime + Math.random() * 0.4 + 0.6).toFixed(2));

      onInputEvent({
        id: `touch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
        formattedTime: formatLogTimestamp(),
        source: "touch_overlay",
        buttonName: name,
        actionType,
        value: actionType === "press" ? val : 0,
        responseTimeMs,
        details: `Touch event on ${name} (${actionType})`,
      });
    },
    [customization.hapticFeedback, onInputEvent]
  );

  // Joystick touch handlers
  const handleJoystickMove = useCallback(
    (
      clientX: number,
      clientY: number,
      containerRef: React.RefObject<HTMLDivElement | null>,
      isLeft: boolean
    ) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const maxRadius = rect.width / 2 - 10;

      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxRadius);
      const angle = Math.atan2(deltaY, deltaX);

      const posX = Math.cos(angle) * distance;
      const posY = Math.sin(angle) * distance;

      const normalizedX = Number((posX / maxRadius).toFixed(2));
      const normalizedY = Number((posY / maxRadius).toFixed(2));

      if (isLeft) {
        setLeftStickPos({ x: posX, y: posY });
        onInputEvent({
          id: `stick-L-${Date.now()}`,
          timestamp: Date.now(),
          formattedTime: formatLogTimestamp(),
          source: "touch_overlay",
          buttonName: "Left Thumbstick",
          actionType: "axis_move",
          value: Math.max(Math.abs(normalizedX), Math.abs(normalizedY)),
          responseTimeMs: Number((0.8 + Math.random() * 0.5).toFixed(2)),
          details: `LX: ${normalizedX}, LY: ${normalizedY}`,
        });
      } else {
        setRightStickPos({ x: posX, y: posY });
        onInputEvent({
          id: `stick-R-${Date.now()}`,
          timestamp: Date.now(),
          formattedTime: formatLogTimestamp(),
          source: "touch_overlay",
          buttonName: "Right Thumbstick",
          actionType: "axis_move",
          value: Math.max(Math.abs(normalizedX), Math.abs(normalizedY)),
          responseTimeMs: Number((0.8 + Math.random() * 0.5).toFixed(2)),
          details: `RX: ${normalizedX}, RY: ${normalizedY}`,
        });
      }
    },
    [onInputEvent]
  );

  // Global touch listeners for sticky joysticks
  useEffect(() => {
    const handleTouchMoveGlobal = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === leftTouchId.current && isDraggingLeft.current) {
          handleJoystickMove(touch.clientX, touch.clientY, leftStickRef, true);
        }
        if (touch.identifier === rightTouchId.current && isDraggingRight.current) {
          handleJoystickMove(touch.clientX, touch.clientY, rightStickRef, false);
        }
      }
    };

    const handleTouchEndGlobal = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === leftTouchId.current) {
          isDraggingLeft.current = false;
          leftTouchId.current = null;
          setLeftStickPos({ x: 0, y: 0 });
          dispatchButton("Left Thumbstick (Center)", "release", 0);
        }
        if (touch.identifier === rightTouchId.current) {
          isDraggingRight.current = false;
          rightTouchId.current = null;
          setRightStickPos({ x: 0, y: 0 });
          dispatchButton("Right Thumbstick (Center)", "release", 0);
        }
      }
    };

    window.addEventListener("touchmove", handleTouchMoveGlobal, { passive: true });
    window.addEventListener("touchend", handleTouchEndGlobal, { passive: true });
    window.addEventListener("touchcancel", handleTouchEndGlobal, { passive: true });

    return () => {
      window.removeEventListener("touchmove", handleTouchMoveGlobal);
      window.removeEventListener("touchend", handleTouchEndGlobal);
      window.removeEventListener("touchcancel", handleTouchEndGlobal);
    };
  }, [dispatchButton, handleJoystickMove]);

  // Sizing scale maps
  const scaleClass =
    customization.size === "compact"
      ? "scale-90"
      : customization.size === "large"
      ? "scale-110"
      : "scale-100";

  // Position layout padding
  const posPadding =
    customization.position === "wide"
      ? "px-2 sm:px-4"
      : customization.position === "compact_edges"
      ? "px-1 sm:px-2"
      : "px-4 sm:px-8";

  const isBtnActive = (name: string) => activeButtons.has(name);

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex flex-col justify-between select-none ${posPadding} py-3 sm:py-6 transition-opacity duration-200 z-30`}
      style={{ opacity: customization.opacity / 100 }}
    >
      {/* Top Shoulder Triggers & Bumpers */}
      <div className="flex items-center justify-between pointer-events-auto w-full max-w-5xl mx-auto px-2">
        {/* Left Shoulder Cluster */}
        <div className={`flex items-center gap-2 sm:gap-3 ${scaleClass} origin-top-left`}>
          <button
            onPointerDown={(e) => { e.preventDefault(); dispatchButton("L2 Trigger", "press"); }}
            onPointerUp={(e) => { e.preventDefault(); dispatchButton("L2 Trigger", "release"); }}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm border tracking-wider transition-all active:scale-95 shadow-lg ${
              isBtnActive("L2 Trigger")
                ? "bg-pink-500 text-white border-pink-400 shadow-pink-500/50 scale-95"
                : "bg-neutral-900/80 text-white/90 border-white/20 hover:border-pink-500/50 backdrop-blur-md"
            }`}
          >
            {getBumperLabel("L", "2")}
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); dispatchButton("L1 Bumper", "press"); }}
            onPointerUp={(e) => { e.preventDefault(); dispatchButton("L1 Bumper", "release"); }}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm border tracking-wider transition-all active:scale-95 shadow-lg ${
              isBtnActive("L1 Bumper")
                ? "bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/50 scale-95"
                : "bg-neutral-900/80 text-white/90 border-white/20 hover:border-cyan-500/50 backdrop-blur-md"
            }`}
          >
            {getBumperLabel("L", "1")}
          </button>
        </div>

        {/* Center Quick Navigation (Select / Home / Start) */}
        <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto">
          <button
            onPointerDown={(e) => { e.preventDefault(); dispatchButton("View / Select", "press"); }}
            onPointerUp={(e) => { e.preventDefault(); dispatchButton("View / Select", "release"); }}
            className={`w-9 h-6 sm:w-11 sm:h-7 rounded-full border text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all ${
              isBtnActive("View / Select")
                ? "bg-pink-500 text-white border-pink-400"
                : "bg-neutral-900/80 text-white/70 border-white/20 backdrop-blur-md"
            }`}
          >
            VIEW
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); dispatchButton("Genjutsu Home", "press"); }}
            onPointerUp={(e) => { e.preventDefault(); dispatchButton("Genjutsu Home", "release"); }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 text-[11px] font-black flex items-center justify-center transition-all shadow-md ${
              isBtnActive("Genjutsu Home")
                ? "bg-pink-500 text-white border-white shadow-pink-500/60"
                : "bg-neutral-950/90 text-pink-400 border-pink-500/50 backdrop-blur-md hover:border-pink-500"
            }`}
            title="Genjutsu Cloud Guide"
          >
            雲
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); dispatchButton("Menu / Start", "press"); }}
            onPointerUp={(e) => { e.preventDefault(); dispatchButton("Menu / Start", "release"); }}
            className={`w-9 h-6 sm:w-11 sm:h-7 rounded-full border text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all ${
              isBtnActive("Menu / Start")
                ? "bg-pink-500 text-white border-pink-400"
                : "bg-neutral-900/80 text-white/70 border-white/20 backdrop-blur-md"
            }`}
          >
            MENU
          </button>
        </div>

        {/* Right Shoulder Cluster */}
        <div className={`flex items-center gap-2 sm:gap-3 ${scaleClass} origin-top-right`}>
          <button
            onPointerDown={(e) => { e.preventDefault(); dispatchButton("R1 Bumper", "press"); }}
            onPointerUp={(e) => { e.preventDefault(); dispatchButton("R1 Bumper", "release"); }}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm border tracking-wider transition-all active:scale-95 shadow-lg ${
              isBtnActive("R1 Bumper")
                ? "bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/50 scale-95"
                : "bg-neutral-900/80 text-white/90 border-white/20 hover:border-cyan-500/50 backdrop-blur-md"
            }`}
          >
            {getBumperLabel("R", "1")}
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); dispatchButton("R2 Trigger", "press"); }}
            onPointerUp={(e) => { e.preventDefault(); dispatchButton("R2 Trigger", "release"); }}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm border tracking-wider transition-all active:scale-95 shadow-lg ${
              isBtnActive("R2 Trigger")
                ? "bg-pink-500 text-white border-pink-400 shadow-pink-500/50 scale-95"
                : "bg-neutral-900/80 text-white/90 border-white/20 hover:border-pink-500/50 backdrop-blur-md"
            }`}
          >
            {getBumperLabel("R", "2")}
          </button>
        </div>
      </div>

      {/* Main Thumb Control Zones (Left Stick & D-Pad | Right Buttons & Aim Stick) */}
      <div className="flex items-end justify-between pointer-events-auto w-full max-w-6xl mx-auto px-2 pb-2">
        {/* Left Thumb Section: Virtual Left Analog Stick & Mini D-Pad */}
        <div className={`flex flex-col items-center gap-4 ${scaleClass} origin-bottom-left`}>
          {/* Virtual Left Analog Stick */}
          <div
            ref={leftStickRef}
            onTouchStart={(e) => {
              const touch = e.changedTouches[0];
              leftTouchId.current = touch.identifier;
              isDraggingLeft.current = true;
              handleJoystickMove(touch.clientX, touch.clientY, leftStickRef, true);
            }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-neutral-900/70 border-2 border-white/20 flex items-center justify-center relative touch-none backdrop-blur-md shadow-2xl shadow-black/80"
          >
            {/* Stick Crosshair Markings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-white" />
              <div className="h-full w-[1px] bg-white absolute" />
            </div>
            {/* Movable Thumb Handle */}
            <div
              style={{
                transform: `translate(${leftStickPos.x}px, ${leftStickPos.y}px)`,
              }}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-transform duration-75 shadow-lg ${
                leftStickPos.x !== 0 || leftStickPos.y !== 0
                  ? "bg-pink-500/40 border-pink-400 shadow-pink-500/40"
                  : "bg-neutral-800/90 border-white/40"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-pink-500/80" />
            </div>
            <span className="absolute -bottom-5 text-[10px] sm:text-xs font-mono text-white/50 tracking-wider">
              MOVE (L3)
            </span>
          </div>

          {/* Mini Ergonomic D-Pad */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* D-Pad Up */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("D-Pad Up", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("D-Pad Up", "release"); }}
              className={`absolute top-0 w-8 h-9 sm:w-9 sm:h-10 rounded-t-lg border-t border-x flex items-center justify-center text-xs font-bold transition-all ${
                isBtnActive("D-Pad Up")
                  ? "bg-pink-500 text-white border-pink-400 shadow-md scale-95"
                  : "bg-neutral-900/85 text-white/80 border-white/20 hover:border-pink-500/40"
              }`}
            >
              ▲
            </button>
            {/* D-Pad Down */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("D-Pad Down", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("D-Pad Down", "release"); }}
              className={`absolute bottom-0 w-8 h-9 sm:w-9 sm:h-10 rounded-b-lg border-b border-x flex items-center justify-center text-xs font-bold transition-all ${
                isBtnActive("D-Pad Down")
                  ? "bg-pink-500 text-white border-pink-400 shadow-md scale-95"
                  : "bg-neutral-900/85 text-white/80 border-white/20 hover:border-pink-500/40"
              }`}
            >
              ▼
            </button>
            {/* D-Pad Left */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("D-Pad Left", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("D-Pad Left", "release"); }}
              className={`absolute left-0 w-9 h-8 sm:w-10 sm:h-9 rounded-l-lg border-l border-y flex items-center justify-center text-xs font-bold transition-all ${
                isBtnActive("D-Pad Left")
                  ? "bg-pink-500 text-white border-pink-400 shadow-md scale-95"
                  : "bg-neutral-900/85 text-white/80 border-white/20 hover:border-pink-500/40"
              }`}
            >
              ◀
            </button>
            {/* D-Pad Right */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("D-Pad Right", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("D-Pad Right", "release"); }}
              className={`absolute right-0 w-9 h-8 sm:w-10 sm:h-9 rounded-r-lg border-r border-y flex items-center justify-center text-xs font-bold transition-all ${
                isBtnActive("D-Pad Right")
                  ? "bg-pink-500 text-white border-pink-400 shadow-md scale-95"
                  : "bg-neutral-900/85 text-white/80 border-white/20 hover:border-pink-500/40"
              }`}
            >
              ▶
            </button>
            {/* Center deadzone */}
            <div className="w-8 h-8 rounded-sm bg-neutral-950 border border-white/10" />
          </div>
        </div>

        {/* Right Thumb Section: ABXY Action Diamond & Right Aim Stick */}
        <div className={`flex flex-col items-center gap-4 ${scaleClass} origin-bottom-right`}>
          {/* Action Diamond Buttons (Y Top, X Left, B Right, A Bottom) */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Y Button (Top) */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("Button Y", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("Button Y", "release"); }}
              className={`absolute top-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-black text-sm sm:text-base transition-all active:scale-90 shadow-lg ${
                isBtnActive("Button Y")
                  ? "bg-amber-400 text-black border-white shadow-amber-400/60 scale-95"
                  : "bg-neutral-900/85 text-amber-300 border-amber-400/40 hover:border-amber-400 backdrop-blur-md"
              }`}
            >
              {getButtonLabel("Y")}
            </button>

            {/* X Button (Left) */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("Button X", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("Button X", "release"); }}
              className={`absolute left-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-black text-sm sm:text-base transition-all active:scale-90 shadow-lg ${
                isBtnActive("Button X")
                  ? "bg-blue-500 text-white border-white shadow-blue-500/60 scale-95"
                  : "bg-neutral-900/85 text-blue-400 border-blue-400/40 hover:border-blue-400 backdrop-blur-md"
              }`}
            >
              {getButtonLabel("X")}
            </button>

            {/* B Button (Right) */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("Button B", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("Button B", "release"); }}
              className={`absolute right-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-black text-sm sm:text-base transition-all active:scale-90 shadow-lg ${
                isBtnActive("Button B")
                  ? "bg-red-500 text-white border-white shadow-red-500/60 scale-95"
                  : "bg-neutral-900/85 text-red-400 border-red-400/40 hover:border-red-400 backdrop-blur-md"
              }`}
            >
              {getButtonLabel("B")}
            </button>

            {/* A Button (Bottom) */}
            <button
              onPointerDown={(e) => { e.preventDefault(); dispatchButton("Button A", "press"); }}
              onPointerUp={(e) => { e.preventDefault(); dispatchButton("Button A", "release"); }}
              className={`absolute bottom-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-black text-sm sm:text-base transition-all active:scale-90 shadow-lg ${
                isBtnActive("Button A")
                  ? "bg-emerald-500 text-white border-white shadow-emerald-500/60 scale-95"
                  : "bg-neutral-900/85 text-emerald-400 border-emerald-400/40 hover:border-emerald-400 backdrop-blur-md"
              }`}
            >
              {getButtonLabel("A")}
            </button>
          </div>

          {/* Right Aim Thumbstick */}
          <div
            ref={rightStickRef}
            onTouchStart={(e) => {
              const touch = e.changedTouches[0];
              rightTouchId.current = touch.identifier;
              isDraggingRight.current = true;
              handleJoystickMove(touch.clientX, touch.clientY, rightStickRef, false);
            }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-900/70 border-2 border-white/20 flex items-center justify-center relative touch-none backdrop-blur-md shadow-2xl shadow-black/80"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-white" />
              <div className="h-full w-[1px] bg-white absolute" />
            </div>
            <div
              style={{
                transform: `translate(${rightStickPos.x}px, ${rightStickPos.y}px)`,
              }}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center transition-transform duration-75 shadow-lg ${
                rightStickPos.x !== 0 || rightStickPos.y !== 0
                  ? "bg-cyan-500/40 border-cyan-400 shadow-cyan-500/40"
                  : "bg-neutral-800/90 border-white/40"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-cyan-400/80" />
            </div>
            <span className="absolute -bottom-5 text-[10px] sm:text-xs font-mono text-white/50 tracking-wider">
              AIM (R3)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
