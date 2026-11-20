import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Login() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLoading(true);
    setError(null);
    setUnauthorizedDomain(null);

    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      const code = err?.code || "";
      const msg = err?.message || "";
      const currentDomain = window.location.hostname;
      
      let userFriendlyError = "";

      if (code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
        setUnauthorizedDomain(currentDomain);
        userFriendlyError = `This preview domain (${currentDomain}) is not yet authorized in Firebase Console.`;
      } else if (code === "auth/popup-blocked" || msg.includes("popup-blocked")) {
        userFriendlyError = "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (code === "auth/popup-closed-by-user" || msg.includes("popup-closed-by-user")) {
        userFriendlyError = "Sign-in was cancelled before completion. Please click Continue with Google to try again.";
      } else if (code === "auth/operation-not-allowed" || msg.includes("operation-not-allowed")) {
        userFriendlyError = "Google Sign-In provider is not enabled in Firebase Console. Go to Authentication > Sign-in method and enable Google.";
      } else if (code === "auth/invalid-api-key" || msg.includes("invalid-api-key")) {
        userFriendlyError = "Invalid Firebase API Key. Please verify the Web API Key in your Firebase Project Settings.";
      } else if (code === "auth/network-request-failed" || msg.includes("network-request-failed")) {
        userFriendlyError = "Network error connecting to Firebase. Please check your internet connection.";
      } else {
        userFriendlyError = msg || "Failed to sign in. Please verify your Firebase project setup.";
      }

      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const copyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 flex items-center justify-center relative z-10 px-4 sm:px-6">
        <div className="max-w-md w-full">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/60 text-sm">Sign in to access your Genjutsu Arena</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/15 border border-red-500/40 rounded-2xl text-red-200 text-sm">
                <div className="text-center font-medium mb-2">{error}</div>
                {unauthorizedDomain && (
                  <div className="mt-3 pt-3 border-t border-red-500/20 text-xs text-white/80 space-y-2">
                    <p className="text-white/60">
                      Add this domain in <strong className="text-white">Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</strong>:
                    </p>
                    <div className="flex items-center justify-between gap-2 bg-black/40 p-2 rounded-xl border border-white/10 font-mono text-[11px] text-pink-300">
                      <span className="truncate">{unauthorizedDomain}</span>
                      <button
                        type="button"
                        onClick={copyDomain}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-sans transition-all shrink-0"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <button 
                type="button"
                onClick={(e) => handleGoogleLogin(e)}
                disabled={isLoading}
                className="w-full py-3.5 rounded-full font-semibold transition-all bg-white text-black hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-white/10 cursor-pointer"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-white/40">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

