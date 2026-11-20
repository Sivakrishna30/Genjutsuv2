import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/images/IMG_1281.jpeg";

export function Header() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  const displayName = profile?.username || profile?.displayName || user?.displayName || (user?.email ? user.email.split("@")[0] : "Gamer");

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <img 
            src={logoImg} 
            alt="Genjutsu Game Arena Logo" 
            referrerPolicy="no-referrer"
            className="w-10 h-10 object-contain mix-blend-screen transition-transform group-hover:scale-105"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-widest text-white uppercase">Genjutsu</span>
            <span className="text-xs font-medium text-white/50 uppercase tracking-widest hidden sm:block">Game Arena</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#games" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Games</a>
          <a href="/#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing and Slots</a>
          <a href="/#faq" className="text-sm font-medium text-white/70 hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 hover:border-white/20 transition-all text-left"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-pink-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/40">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-white max-w-[120px] truncate hidden sm:inline">
                  {displayName}
                </span>
                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-neutral-950 border border-white/15 rounded-2xl shadow-xl shadow-black/80 py-2 z-50"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-white/5">
                    <div className="text-xs text-white/40 uppercase tracking-wider">Signed in as</div>
                    <div className="text-sm font-semibold text-white truncate">{displayName}</div>
                    <div className="text-xs text-white/50 truncate">{user.email}</div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Dashboard and Library
                  </Link>

                  <a
                    href="/#pricing"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Book New Slot
                  </a>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-sm font-semibold text-black bg-white hover:bg-white/90 px-6 py-2.5 rounded-full transition-all shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
