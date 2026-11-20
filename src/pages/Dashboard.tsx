import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SlotBookingModal } from "../components/SlotBookingModal";
import { VirtualMachineStreamModal } from "../components/VirtualMachineStreamModal";
import { getUserBookings, formatTo12Hour, Booking } from "../lib/bookingService";
import { SUPPORTED_GAMES, SupportedGame } from "../data/games";
import { CheckCircle2, MonitorPlay, Sparkles, Play, Gamepad2, Activity, Cpu } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVMModalOpen, setIsVMModalOpen] = useState(false);
  const [selectedGameForVM, setSelectedGameForVM] = useState<string>("Genjutsu RTX 4090 Cloud Rig");
  const [selectedGameForBooking, setSelectedGameForBooking] = useState<string | undefined>(undefined);
  const [selectedLauncherFilter, setSelectedLauncherFilter] = useState<string>("All");

  const filteredGames = selectedLauncherFilter === "All"
    ? SUPPORTED_GAMES
    : SUPPORTED_GAMES.filter((g) => g.launcher === selectedLauncherFilter);

  const launchers = ["All", "Steam", "Epic Games", "Xbox"];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function loadBookings() {
      if (user) {
        try {
          const userBookings = await getUserBookings(user.uid);
          setBookings(userBookings);
        } catch (err) {
          console.error("Failed to load user bookings:", err);
        } finally {
          setLoadingBookings(false);
        }
      }
    }

    if (user) {
      loadBookings();
    }
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-medium">Loading your Genjutsu Arena...</div>
      </div>
    );
  }

  const displayName = profile?.username || profile?.displayName || user?.displayName || (user?.email ? user.email.split("@")[0] : "Player");

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 relative z-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* User Profile Header Card */}
          <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 sm:gap-6">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-pink-500 shadow-lg shadow-pink-500/20"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-500/20 text-pink-400 font-bold text-2xl flex items-center justify-center border-2 border-pink-500/40">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayName}</h1>
                  <span className="px-3 py-1 bg-pink-500/20 text-pink-400 border border-pink-500/40 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Gamer
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setSelectedGameForVM("Genjutsu Cloud RTX 4090 Stream");
                  setIsVMModalOpen(true);
                }}
                className="flex-1 md:flex-initial px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-pink-500/25 text-sm flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Launch VM Stream & Test Controls</span>
              </button>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex-1 md:flex-initial px-5 py-3 border border-pink-500/50 hover:bg-pink-500/10 text-pink-300 rounded-full font-semibold transition-all text-sm text-center"
              >
                + Book Slot
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-3 border border-white/15 hover:border-white/30 text-white/80 hover:text-white rounded-full text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Reserved GPU Slots Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Reserved GPU Slots</h2>
                <p className="text-white/60 text-sm">Your upcoming cloud gaming sessions.</p>
              </div>
            </div>

            {loadingBookings ? (
              <div className="p-8 text-center text-white/50 bg-neutral-950 border border-white/10 rounded-3xl">
                Loading reservations...
              </div>
            ) : bookings.length === 0 ? (
              <div className="border border-white/10 rounded-3xl bg-neutral-950/60 p-8 sm:p-12 text-center">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white/40">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">No Booked Slots Yet</h3>
                <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
                  Reserve a dedicated cloud GPU slot for 1080p, 1440p, or 4K 60FPS gaming.
                </p>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-semibold text-sm transition-all"
                >
                  Check Available Slots
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="bg-neutral-950 border border-white/10 rounded-3xl p-6 hover:border-pink-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-bold rounded-full">
                          {booking.tier} Quality
                        </span>
                        <span className="text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full capitalize">
                          {booking.status}
                        </span>
                      </div>

                      <div className="text-xl font-bold text-white mb-1">
                        {booking.date}
                      </div>
                      <div className="text-sm font-medium text-white/70 mb-4">
                        {formatTo12Hour(booking.startTime)} - {formatTo12Hour(booking.endTime)} ({booking.durationHours} hr)
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-white/40">Total Paid</div>
                          <div className="text-base font-bold text-white">₹{booking.totalAmount}</div>
                        </div>
                        <span className="font-mono text-xs text-white/30 truncate max-w-[120px]">
                          {booking.bookingId}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedGameForVM(`Session ${booking.bookingId} (${booking.tier} 60FPS)`);
                          setIsVMModalOpen(true);
                        }}
                        className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-500/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Launch Session Stream</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Supported Games & Launchers Table */}
            <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-lg">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Supported Games & Launchers</h2>
                  <p className="text-white/60 text-xs sm:text-sm">
                    Verified pre-installed titles ready for instant cloud session launching.
                  </p>
                </div>

                {/* Launcher Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
                  {launchers.map((launcher) => (
                    <button
                      key={launcher}
                      onClick={() => setSelectedLauncherFilter(launcher)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedLauncherFilter === launcher
                          ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {launcher === "All" ? `All (${SUPPORTED_GAMES.length})` : launcher}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table View: Game and Native Launcher Only */}
              <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider font-semibold">
                      <th className="pb-3 pr-4">Game</th>
                      <th className="pb-3 pl-4 text-right sm:text-left">Launcher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredGames.map((game: SupportedGame) => (
                      <tr
                        key={game.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Game Title & Thumbnail */}
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                              <img
                                src={game.image}
                                alt={game.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-pink-400 transition-colors">
                                {game.title}
                              </div>
                              <div className="text-xs text-white/50">{game.genre}</div>
                            </div>
                          </div>
                        </td>

                        {/* Native Launcher */}
                        <td className="py-3.5 pl-4 text-right sm:text-left">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${game.launcherColor}`}>
                            <img
                              src={game.launcherIcon}
                              alt={game.launcher}
                              referrerPolicy="no-referrer"
                              className="w-3.5 h-3.5 object-contain"
                            />
                            <span>{game.launcher}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </main>
      <Footer />

      <SlotBookingModal
        isOpen={isBookingModalOpen}
        initialGameTitle={selectedGameForBooking}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedGameForBooking(undefined);
          if (user) {
            getUserBookings(user.uid).then(setBookings);
          }
        }}
      />

      <VirtualMachineStreamModal
        isOpen={isVMModalOpen}
        gameTitle={selectedGameForVM}
        onClose={() => setIsVMModalOpen(false)}
      />
    </>
  );
}
