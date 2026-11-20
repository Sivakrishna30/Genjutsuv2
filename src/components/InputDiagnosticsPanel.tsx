import { useState } from "react";
import { InputLogEvent, PhysicalGamepadInfo, ControllerInputSource } from "../types/controller";
import { Activity, Gamepad2, Keyboard, Touchpad, Trash2, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface InputDiagnosticsPanelProps {
  logs: InputLogEvent[];
  activeSource: ControllerInputSource;
  physicalGamepads: PhysicalGamepadInfo[];
  onClearLogs: () => void;
}

export function InputDiagnosticsPanel({
  logs,
  activeSource,
  physicalGamepads,
  onClearLogs,
}: InputDiagnosticsPanelProps) {
  const [filterSource, setFilterSource] = useState<string>("all");

  // Calculate live statistics
  const totalEvents = logs.length;
  const latencies = logs.map((l) => l.responseTimeMs);
  const avgLatency =
    latencies.length > 0
      ? (latencies.reduce((acc, curr) => acc + curr, 0) / latencies.length).toFixed(2)
      : "0.00";
  const minLatency =
    latencies.length > 0 ? Math.min(...latencies).toFixed(2) : "0.00";
  const maxLatency =
    latencies.length > 0 ? Math.max(...latencies).toFixed(2) : "0.00";

  const filteredLogs =
    filterSource === "all"
      ? logs
      : logs.filter((l) => l.source === filterSource);

  return (
    <div className="bg-neutral-950 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col h-full shadow-2xl">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Input Engine & Response Telemetry
            </h3>
            <p className="text-xs text-white/50">
              Live button events, hardware polling, & sub-millisecond dispatch logs.
            </p>
          </div>
        </div>

        {/* Controller Status Badge */}
        <div className="flex items-center gap-2">
          {physicalGamepads.length > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Gamepad2 className="w-4 h-4" />
              <span>{physicalGamepads[0].id.slice(0, 20)}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          ) : activeSource === "touch_overlay" ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-semibold">
              <Touchpad className="w-4 h-4" />
              <span>Touch HUD Active (Fallback)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Keyboard className="w-4 h-4" />
              <span>Keyboard & Mouse Active (Fallback)</span>
            </div>
          )}
        </div>
      </div>

      {/* Latency Benchmarks Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="text-[11px] text-white/50 uppercase tracking-wider font-mono">Avg Latency</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 flex items-baseline gap-1 mt-0.5">
            {avgLatency} <span className="text-xs text-white/40 font-sans">ms</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="text-[11px] text-white/50 uppercase tracking-wider font-mono">Min Response</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 flex items-baseline gap-1 mt-0.5">
            {minLatency} <span className="text-xs text-white/40 font-sans">ms</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="text-[11px] text-white/50 uppercase tracking-wider font-mono">Peak Response</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 flex items-baseline gap-1 mt-0.5">
            {maxLatency} <span className="text-xs text-white/40 font-sans">ms</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="text-[11px] text-white/50 uppercase tracking-wider font-mono">Total Packets</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white flex items-baseline gap-1 mt-0.5">
            {totalEvents}
          </div>
        </div>
      </div>

      {/* Filter and Clear Tools */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
          {[
            { id: "all", label: "All Inputs" },
            { id: "physical_gamepad", label: "Physical Pad" },
            { id: "touch_overlay", label: "Touch HUD" },
            { id: "keyboard_mouse", label: "KBM" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSource(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterSource === tab.id
                  ? "bg-pink-500 text-white font-semibold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClearLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-red-500/40 text-white/60 hover:text-red-400 text-xs font-medium transition-all"
          title="Clear Log History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Live Logs Stream Table */}
      <div className="flex-1 overflow-y-auto max-h-72 sm:max-h-80 border border-white/10 rounded-2xl bg-black/60 p-2 font-mono text-xs divide-y divide-white/5">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-white/40 flex flex-col items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-white/20" />
            <span>Awaiting input... Press any controller button, touch button, or keyboard key.</span>
          </div>
        ) : (
          filteredLogs.slice(0, 100).map((log) => {
            const isFast = log.responseTimeMs <= 2.0;
            const isMedium = log.responseTimeMs > 2.0 && log.responseTimeMs <= 5.0;

            return (
              <div
                key={log.id}
                className="py-2 px-2 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors rounded-lg"
              >
                {/* Time & Source */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-white/40 text-[11px] shrink-0">{log.formattedTime}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                      log.source === "physical_gamepad"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : log.source === "touch_overlay"
                        ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {log.source === "physical_gamepad" ? "PAD" : log.source === "touch_overlay" ? "TOUCH" : "KBM"}
                  </span>
                  <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[220px]">
                    {log.buttonName}
                  </span>
                </div>

                {/* Response Time & Details */}
                <div className="flex items-center gap-3 shrink-0">
                  {log.details && (
                    <span className="text-white/40 text-[11px] hidden md:inline truncate max-w-[120px]">
                      {log.details}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                      isFast
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isMedium
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    {log.responseTimeMs} ms
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Hardware Note Footer */}
      {physicalGamepads.length === 0 && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-2xl bg-pink-950/20 border border-pink-500/20 text-pink-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-pink-400" />
          <span>
            Connect any Bluetooth or USB controller (Xbox, PS5, Switch) to test real-time hardware detection!
          </span>
        </div>
      )}
    </div>
  );
}
