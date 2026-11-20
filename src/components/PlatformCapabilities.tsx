import { useState, useEffect } from "react";
import { Activity, Smartphone, Tablet, Laptop, Monitor, Wifi, Youtube } from "lucide-react";

const devices = [
  { icon: Smartphone, name: "Phone" },
  { icon: Tablet, name: "Tablet" },
  { icon: Laptop, name: "Laptop" },
  { icon: Monitor, name: "Desktop" },
];

export function PlatformCapabilities() {
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [measuredSpeed, setMeasuredSpeed] = useState<number | null>(null);

  useEffect(() => {
    if (!isTesting) return;
    
    let isCancelled = false;
    
    const runTest = async () => {
      setTestProgress(0);
      setMeasuredSpeed(0);
      
      try {
        const TEST_DURATION_MS = 20000;
        const testStartTime = performance.now();
        let totalBytes = 0;

        while (performance.now() - testStartTime < TEST_DURATION_MS && !isCancelled) {
          const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg?t=" + Date.now();
          const response = await fetch(imageUrl);
          
          if (!response.body) throw new Error("No response body");
          
          const reader = response.body.getReader();
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done || isCancelled) {
              break;
            }
            
            if (value) {
              totalBytes += value.length;
            }
            
            const elapsed = performance.now() - testStartTime;
            setTestProgress(Math.min((elapsed / TEST_DURATION_MS) * 100, 100));
            
            if (elapsed > 1000) {
               const mbps = (totalBytes * 8) / (elapsed / 1000) / 1000000;
               setMeasuredSpeed(Math.floor(mbps));
            }

            if (elapsed >= TEST_DURATION_MS) {
              break;
            }
          }
        }
        
        if (!isCancelled) {
          const finalElapsed = performance.now() - testStartTime;
          const finalMbps = (totalBytes * 8) / (finalElapsed / 1000) / 1000000;
          setMeasuredSpeed(Math.floor(finalMbps));
          setTestProgress(100);
        }
      } catch (err) {
        console.error("Speed test failed:", err);
        if (!isCancelled) {
           alert("Speed test failed due to a network error. Please try again.");
           setMeasuredSpeed(null);
        }
      } finally {
        if (!isCancelled) setIsTesting(false);
      }
    };

    runTest();

    return () => {
      isCancelled = true;
    };
  }, [isTesting]);

  const getRecommendation = (speed: number) => {
    if (speed >= 50) return "4K @ 60FPS Optimal";
    if (speed >= 25) return "1080p @ 60FPS Good";
    return "720p @ 30FPS Minimum";
  };

  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform Capabilities</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Our cloud architecture brings high-end gaming to any device. Check our hardware integrations, network requirements, and session features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Left side: Telemetry & Network & YouTube */}
           <div className="flex flex-col gap-8">
             {/* Telemetry Card */}
             <div className="p-8 rounded-2xl bg-black border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                     <Activity className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Real-Time Telemetry</h3>
                    <p className="text-sm text-white/60">Built-in HUD to monitor your session.</p>
                  </div>
                </div>
                <div className="p-4 bg-neutral-900 rounded-xl border border-white/5 font-mono text-xs text-green-400 flex flex-wrap items-center gap-x-6 gap-y-3">
                   <div className="flex items-center gap-2"><span className="text-white/40">Ping</span> 12ms</div>
                   <div className="flex items-center gap-2"><span className="text-white/40">Framerate</span> 60 FPS</div>
                   <div className="flex items-center gap-2"><span className="text-white/40">Resolution</span> 4K UHD</div>
                   <div className="flex items-center gap-2"><span className="text-white/40">Status</span> Optimal</div>
                </div>
                <p className="text-white/60 text-sm mt-4 leading-relaxed">
                  Instantly diagnose lag with our transparent stream telemetry. We expose real-time metrics so you know exactly how your connection is performing.
                </p>
             </div>

             {/* Network Requirement & Speed Tester Card */}
             <div className="p-8 rounded-2xl bg-black border border-white/5">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                     <Wifi className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Network & Speed</h3>
                    <p className="text-sm text-white/60">Test your connection stability.</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{measuredSpeed !== null ? measuredSpeed : "50+"}</span>
                    <span className="text-white/60">Mbps</span>
                  </div>
                  <button 
                    onClick={() => !isTesting && setIsTesting(true)}
                    disabled={isTesting}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {isTesting ? "Testing..." : "Test Connection"}
                  </button>
                </div>

                {isTesting && (
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-pink-500 transition-all duration-300 ease-out"
                      style={{ width: `${testProgress}%` }}
                    />
                  </div>
                )}

                {measuredSpeed !== null && !isTesting && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4 text-sm text-green-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Recommended: {getRecommendation(measuredSpeed)}
                  </div>
                )}

                <p className="text-white/60 text-sm">
                  Minimum recommended stable connection speed for 1080p 60FPS streaming. 5GHz Wi-Fi or Ethernet preferred for the lowest latency.
                </p>
             </div>
           </div>

           {/* Right side: Supported Devices & Integrations */}
           <div className="flex flex-col gap-8">
             {/* Devices Card */}
             <div className="p-8 rounded-2xl bg-black border border-white/5">
               <h3 className="text-lg font-bold text-white mb-6">Play on Any Device</h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {devices.map((device, index) => {
                    const Icon = device.icon;
                    return (
                      <div key={index} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <Icon className="w-6 h-6 text-pink-400" />
                        <span className="text-white/80 font-medium text-sm">{device.name}</span>
                      </div>
                    );
                 })}
               </div>
             </div>

             {/* Store Integrations Card */}
             <div className="p-8 rounded-2xl bg-black border border-white/5">
                <h3 className="text-lg font-bold text-white mb-2">Store Integrations</h3>
                <p className="text-sm text-white/60 mb-6">Connect your existing accounts to sync your libraries and cloud saves.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 text-sm hover:bg-white/10 transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" alt="Steam logo" className="w-5 h-5" />
                      Steam
                   </div>
                   <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 text-sm hover:bg-white/10 transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg" alt="Epic Games logo" className="w-5 h-5" />
                      Epic
                   </div>
                   <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 text-sm hover:bg-white/10 transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg" alt="Xbox logo" className="w-5 h-5" />
                      Xbox
                   </div>
                </div>
             </div>

             {/* Hardware Rental Card */}
             <div className="p-8 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex-grow relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                     <Smartphone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Pro Controller Rental</h3>
                    <p className="text-sm text-white/60">India Metro Cities</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Don't have a gaming controller? Rent a premium wireless controller as a monthly add-on. Zero upfront hardware cost, delivered directly to your door.
                </p>
                <button 
                  onClick={() => alert("Backend Not Connected: The Firestore waitlist collection has not been provisioned yet.")}
                  className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-bold rounded-xl transition-colors border border-amber-500/20 flex items-center justify-center gap-2"
                >
                  Join Waitlist
                </button>
             </div>

             {/* YouTube Broadcasting Card */}
             <div className="p-8 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex-grow relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                     <Youtube className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Direct Cloud Broadcasting</h3>
                    <p className="text-sm text-white/60">Stream to YouTube seamlessly.</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Go live instantly. Our servers stream your gameplay directly to YouTube using our backend GPUs. <strong className="text-white">Zero impact on your local internet connection</strong> or gameplay performance.
                </p>
                <button 
                  onClick={() => alert("Backend Not Connected: The Firestore waitlist collection has not been provisioned yet.")}
                  className="w-full py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm font-bold rounded-xl transition-colors border border-purple-500/20 flex items-center justify-center gap-2"
                >
                  Join Waitlist
                </button>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
