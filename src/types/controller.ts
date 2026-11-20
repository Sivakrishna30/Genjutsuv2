export type ControllerInputSource = "physical_gamepad" | "touch_overlay" | "keyboard_mouse";

export type ControllerLayoutTheme = "xbox" | "playstation" | "neon";

export type ControllerSize = "compact" | "normal" | "large";

export type ControllerPosition = "standard" | "wide" | "compact_edges";

export interface InputLogEvent {
  id: string;
  timestamp: number;
  formattedTime: string;
  source: ControllerInputSource;
  buttonName: string;
  actionType: "press" | "release" | "axis_move" | "key_down" | "key_up";
  value: number; // 0.0 - 1.0
  responseTimeMs: number; // calculated input dispatch & processing latency in milliseconds
  details?: string;
}

export interface PhysicalGamepadInfo {
  index: number;
  id: string;
  connected: boolean;
  timestamp: number;
  mapping: string;
  buttonsCount: number;
  axesCount: number;
  vibrationActuatorSupported: boolean;
}

export interface ControllerCustomization {
  opacity: number; // 20 - 100 (%)
  size: ControllerSize;
  theme: ControllerLayoutTheme;
  position: ControllerPosition;
  hapticFeedback: boolean;
  showDiagnostics: boolean;
  forceMode: "auto" | "touch" | "keyboard" | "physical";
}

export interface VMSessionMetrics {
  gpuModel: string;
  vramAllocated: string;
  cpuAllocated: string;
  ramAllocated: string;
  resolution: "1080p" | "1440p" | "4K";
  targetFps: 60 | 120;
  actualFps: number;
  streamBitrateMbps: number;
  decodeLatencyMs: number;
  networkJitterMs: number;
  packetLossPercent: number;
  elapsedSeconds: number;
}
