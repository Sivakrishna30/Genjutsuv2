import { PhysicalGamepadInfo, InputLogEvent } from "../types/controller";

export const STANDARD_BUTTON_NAMES: Record<number, { xbox: string; ps: string }> = {
  0: { xbox: "A", ps: "Cross ✕" },
  1: { xbox: "B", ps: "Circle ◯" },
  2: { xbox: "X", ps: "Square ▢" },
  3: { xbox: "Y", ps: "Triangle △" },
  4: { xbox: "LB (L1)", ps: "L1 Bumper" },
  5: { xbox: "RB (R1)", ps: "R1 Bumper" },
  6: { xbox: "LT (L2 Trigger)", ps: "L2 Trigger" },
  7: { xbox: "RT (R2 Trigger)", ps: "R2 Trigger" },
  8: { xbox: "View / Select", ps: "Share / Create" },
  9: { xbox: "Menu / Start", ps: "Options / Start" },
  10: { xbox: "LS Click (L3)", ps: "L3 Click" },
  11: { xbox: "RS Click (R3)", ps: "R3 Click" },
  12: { xbox: "D-Pad Up", ps: "D-Pad Up" },
  13: { xbox: "D-Pad Down", ps: "D-Pad Down" },
  14: { xbox: "D-Pad Left", ps: "D-Pad Left" },
  15: { xbox: "D-Pad Right", ps: "D-Pad Right" },
  16: { xbox: "Xbox Guide", ps: "PS Home" },
};

export const STANDARD_AXIS_NAMES: Record<number, string> = {
  0: "Left Stick X (Horizontal)",
  1: "Left Stick Y (Vertical)",
  2: "Right Stick X (Horizontal)",
  3: "Right Stick Y (Vertical)",
};

/**
 * Trigger device haptic vibration if supported
 */
export function triggerHapticFeedback(durationMs = 20, gamepadIndex?: number) {
  try {
    // 1. Try physical gamepad vibration actuator if connected
    if (typeof gamepadIndex === "number" && navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[gamepadIndex] as any;
      if (gp?.vibrationActuator && typeof gp.vibrationActuator.playEffect === "function") {
        gp.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: durationMs,
          weakMagnitude: 0.5,
          strongMagnitude: 0.5,
        }).catch(() => {});
        return;
      }
    }

    // 2. Fallback to browser navigator vibration (touch devices / phones)
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(durationMs);
    }
  } catch {
    // Gracefully ignore vibration errors
  }
}

/**
 * Format current timestamp into HH:MM:SS.mmm
 */
export function formatLogTimestamp(now: number = Date.now()): string {
  const d = new Date(now);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  const millis = String(d.getMilliseconds()).padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${millis}`;
}

/**
 * Check if the current browser environment is a touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    ("msMaxTouchPoints" in navigator && (navigator as any).msMaxTouchPoints > 0)
  );
}

/**
 * Get active physical gamepads
 */
export function getActiveGamepads(): PhysicalGamepadInfo[] {
  if (typeof navigator === "undefined" || !navigator.getGamepads) {
    return [];
  }

  const rawGamepads = navigator.getGamepads();
  const list: PhysicalGamepadInfo[] = [];

  for (let i = 0; i < rawGamepads.length; i++) {
      const gp = rawGamepads[i] as any;
      if (gp && gp.connected) {
        list.push({
          index: gp.index,
          id: gp.id || `Gamepad ${gp.index}`,
          connected: gp.connected,
          timestamp: gp.timestamp,
          mapping: gp.mapping || "standard",
          buttonsCount: gp.buttons.length,
          axesCount: gp.axes.length,
          vibrationActuatorSupported: !!gp.vibrationActuator,
        });
      }
  }

  return list;
}
