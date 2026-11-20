/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import logoWatermark from "./assets/images/IMG_1281.jpeg";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 font-sans relative">
          {/* Fixed Background Elements with 50% Transparent Monochrome Logo Watermark */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-950/20 via-black to-black" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={logoWatermark}
                alt="Genjutsu Monochrome Watermark"
                className="w-[95vw] md:w-[75vw] lg:w-[65vw] max-w-5xl h-auto object-contain grayscale opacity-50 mix-blend-screen select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Scrollable Content Overlay */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

