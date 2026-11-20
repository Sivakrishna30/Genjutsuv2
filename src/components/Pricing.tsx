import { useState } from "react";
import { motion } from "motion/react";
import { SlotBookingModal } from "./SlotBookingModal";

export function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<"1080p" | "1440p" | "4K">("1440p");

  const plans: Array<{
    resolution: "1080p" | "1440p" | "4K";
    price: string;
    fps: string;
    badge?: string;
  }> = [
    { resolution: "1080p", price: "80", fps: "60 FPS target", badge: "Standard" },
    { resolution: "1440p", price: "100", fps: "60 FPS target", badge: "Most Popular" },
    { resolution: "4K", price: "120", fps: "60 FPS target", badge: "Ultra" },
  ];

  const handleOpenBooking = () => {
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Simple Gaming Plans
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 mb-8"
          >
            Pay by the hour. Reserve your GPU slot up to 15 days in advance.
          </motion.p>
        </div>

        {/* Single Unified Pricing Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto bg-neutral-950/90 border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {plans.map((plan) => {
              const isSelected = selectedPlanTier === plan.resolution;
              return (
                <div
                  key={plan.resolution}
                  onClick={() => setSelectedPlanTier(plan.resolution)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all border relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-pink-500/10 border-pink-500 ring-1 ring-pink-500/50 shadow-lg shadow-pink-500/10"
                      : "bg-neutral-900/70 border-white/10 hover:border-white/20 hover:bg-neutral-900"
                  }`}
                >
                  {plan.badge && (
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isSelected 
                          ? "bg-pink-500 text-white border-pink-500" 
                          : "bg-white/5 text-white/50 border-white/10"
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{plan.resolution}</h3>
                    <p className="text-sm text-white/60 mb-6">{plan.fps}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-sm text-white/50">/ hour</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-sm text-white/60">Selected Picture Quality</div>
              <div className="text-xl font-bold text-white">
                {selectedPlanTier}{" "}
                <span className="text-sm font-normal text-white/50">
                  (₹{plans.find(p => p.resolution === selectedPlanTier)?.price}/hr)
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenBooking}
              className="w-full sm:w-auto px-10 py-4 rounded-full font-semibold bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-lg shadow-pink-500/25 text-center text-base"
            >
              Check Slots
            </button>
          </div>
        </motion.div>
      </div>

      <SlotBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTier={selectedPlanTier}
      />
    </section>
  );
}
