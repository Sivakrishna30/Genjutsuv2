import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getNext15Days, getAvailableSlots, createBooking, formatTo12Hour, Booking } from "../lib/bookingService";
import { CalendarPicker } from "./CalendarPicker";

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: "1080p" | "1440p" | "4K";
  initialGameTitle?: string;
}

const TIER_PRICES: Record<"1080p" | "1440p" | "4K", number> = {
  "1080p": 80,
  "1440p": 100,
  "4K": 120,
};

export function SlotBookingModal({ isOpen, onClose, initialTier = "1440p", initialGameTitle }: SlotBookingModalProps) {
  const { user, profile, signInWithGoogle } = useAuth();
  
  const [selectedTier, setSelectedTier] = useState<"1080p" | "1440p" | "4K">(initialTier);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [selectedGame, setSelectedGame] = useState<string | undefined>(initialGameTitle);

  // Sync selectedTier whenever initialTier changes or modal opens
  useEffect(() => {
    if (initialTier) {
      setSelectedTier(initialTier);
    }
  }, [initialTier, isOpen]);

  useEffect(() => {
    if (initialGameTitle) {
      setSelectedGame(initialGameTitle);
    }
  }, [initialGameTitle, isOpen]);
  
  const days = useMemo(() => getNext15Days(), []);
  const [selectedDate, setSelectedDate] = useState<string>(days[0]?.dateString || "");

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableSlots(selectedDate, selectedDuration);
  }, [selectedDate, selectedDuration]);

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const selectedSlot = availableSlots[selectedSlotIndex] || availableSlots[0];
  const ratePerHour = TIER_PRICES[selectedTier];
  const totalAmount = ratePerHour * selectedDuration;

  const handleBooking = async () => {
    if (!selectedSlot) {
      setErrorMessage("Please select an available time slot.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let currentUser = user;
      let currentProfile = profile;

      if (!currentUser) {
        currentProfile = await signInWithGoogle();
        currentUser = { uid: currentProfile.uid, email: currentProfile.email } as any;
      }

      if (!currentUser) {
        throw new Error("User authentication required.");
      }

      const booking = await createBooking(
        currentUser.uid,
        currentUser.email || currentProfile?.email || "",
        currentProfile?.username || currentProfile?.displayName || "Player",
        selectedTier,
        ratePerHour,
        selectedDate,
        selectedSlot.startTime,
        selectedSlot.endTime,
        selectedDuration
      );

      setConfirmedBooking(booking);
    } catch (err: any) {
      console.error("Booking failed:", err);
      const code = err?.code || "";
      const msg = err?.message || "";
      if (code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
        const currentDomain = window.location.hostname;
        setErrorMessage(
          `This domain (${currentDomain}) needs to be added to Authorized Domains in Firebase Console > Authentication > Settings > Authorized domains.`
        );
      } else if (code === "auth/popup-blocked" || msg.includes("popup-blocked")) {
        setErrorMessage("Sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else if (code === "auth/popup-closed-by-user" || msg.includes("popup-closed-by-user")) {
        setErrorMessage("Sign-in was cancelled before completion. Please try again.");
      } else if (code === "auth/operation-not-allowed" || msg.includes("operation-not-allowed")) {
        setErrorMessage("Google Sign-In provider is disabled in Firebase. Please enable 'Google' under Authentication > Sign-in method.");
      } else {
        setErrorMessage(msg || "Failed to reserve slot. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setConfirmedBooking(null);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-pink-500/10 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Top Bar with Back Button & Close button */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <button
              onClick={confirmedBooking ? () => setConfirmedBooking(null) : resetModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all group"
            >
              <ArrowLeft className="w-4 h-4 text-white/60 group-hover:text-pink-400 transition-colors group-hover:-translate-x-0.5 transform duration-150" />
              <span>{confirmedBooking ? "Back to Slot Selection" : "Back"}</span>
            </button>

            <button
              onClick={resetModal}
              className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {confirmedBooking ? (
            /* Booking Confirmation View */
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Slot Reserved!</h3>
              <p className="text-white/60 mb-6 text-sm sm:text-base">
                Your high-performance cloud gaming instance is scheduled.
              </p>

              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 text-left mb-8 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/50">Booking ID</span>
                  <span className="font-mono text-white text-xs sm:text-sm font-medium">{confirmedBooking.bookingId}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/50">Picture Quality</span>
                  <span className="text-pink-400 font-semibold">{confirmedBooking.tier} (60 FPS)</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/50">Date</span>
                  <span className="text-white font-medium">{confirmedBooking.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/50">Time Window</span>
                  <span className="text-white font-medium">
                    {formatTo12Hour(confirmedBooking.startTime)} - {formatTo12Hour(confirmedBooking.endTime)} ({confirmedBooking.durationHours} hr)
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-white/50">Total</span>
                  <span className="text-lg font-bold text-white">₹{confirmedBooking.totalAmount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="px-8 py-3.5 rounded-full font-semibold bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/25 text-center"
                >
                  View in Dashboard
                </Link>
                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="px-8 py-3.5 rounded-full font-semibold border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors"
                >
                  Book Another Slot
                </button>
              </div>
            </div>
          ) : (
            /* Slot Booking Form */
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Check Slots and Reserve</h2>
                  {selectedGame && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/15 border border-pink-500/30 text-pink-300">
                      🎮 {selectedGame}
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm">Select your picture quality, date, and time slot.</p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl text-red-200 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Resolution / Plan Tier */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2.5">
                  1. Select Picture Quality
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["1080p", "1440p", "4K"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                        selectedTier === tier
                          ? "bg-pink-500/20 border-pink-500 text-white font-bold ring-1 ring-pink-500/50"
                          : "bg-neutral-900/80 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-base font-bold">{tier}</div>
                      <div className="text-xs text-white/50 mt-0.5">₹{TIER_PRICES[tier]}/hr</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date Selector (Calendar View) */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2.5">
                  2. Choose Date
                </label>
                <CalendarPicker
                  selectedDate={selectedDate}
                  onSelectDate={(newDate) => {
                    setSelectedDate(newDate);
                    setSelectedSlotIndex(0);
                  }}
                  maxDays={15}
                />
              </div>

              {/* Step 3: Duration Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2.5">
                  3. Select Session Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => {
                        setSelectedDuration(hrs);
                        setSelectedSlotIndex(0);
                      }}
                      className={`py-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        selectedDuration === hrs
                          ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                          : "bg-neutral-900 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {hrs} {hrs === 1 ? "Hour" : "Hours"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Time Slots */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2.5">
                  4. Available Time Slots
                </label>
                {availableSlots.length === 0 ? (
                  <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 text-center text-white/50 text-sm">
                    No remaining slots available for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/20">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={slot.startTime}
                        type="button"
                        onClick={() => setSelectedSlotIndex(index)}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-medium text-center transition-all ${
                          selectedSlotIndex === index
                            ? "bg-pink-500/25 border-pink-500 text-white font-bold ring-1 ring-pink-500"
                            : "bg-neutral-900/90 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {slot.display}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 5: Summary & CTA */}
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-white/50">Total Estimated Price</div>
                  <div className="text-2xl font-bold text-white">
                    ₹{totalAmount}{" "}
                    <span className="text-xs font-normal text-white/50">
                      ({selectedDuration} hr @ ₹{ratePerHour}/hr)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={isSubmitting || availableSlots.length === 0}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold bg-pink-500 hover:bg-pink-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
                >
                  {isSubmitting ? (
                    "Confirming Slot..."
                  ) : user ? (
                    "Confirm & Book Slot"
                  ) : (
                    "Sign In with Google to Book"
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
