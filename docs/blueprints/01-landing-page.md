# Blueprint: Landing Page

## 1. Purpose
The primary entry and marketing page for Genjutsu Game Arena. It introduces the product's core value proposition (cloud gaming, BYOG, pay-by-the-hour), showcases the platform capabilities (including a real-time internet speed test), highlights pricing tiers, and provides a Frequently Asked Questions section. 

## 2. UI & Layout Rules (Genjutsu Design System)
*Based on the existing scaffolding in `PLAN.md` and `App.tsx`.*
- **Base Theme:** Deep dark mode default (`bg-black`).
- **Accent Colors:** Neon Pink/Purple/Fuchsia gradients (e.g., `text-pink-500`, `bg-pink-500`), Amber for specific callouts.
- **Typography:** High-contrast white text for headings (`text-white`), muted text for descriptions (`text-white/60`).
- **Layout Structure:** Full-width structural sections using `<section className="py-24">`. Content constrained using `max-w-7xl mx-auto px-6` (or `max-w-3xl` for narrow sections like FAQ).
- **Universal Responsiveness:** Fully fluid layouts utilizing CSS grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`) and responsive padding.
- **Component Styling:** 
  - Cards and structural blocks use subtle borders (`border-white/5` or `border-white/10`).
  - Background imagery employs heavy dark overlays (`bg-black/60` to `bg-black/80`).
  - Glassmorphism effects where appropriate (`backdrop-blur-md`, `bg-black/40`).
  - Interactive elements feature smooth transitions (`transition-all duration-300`).

## 3. Data Dependencies
- **Reads (Firestore/API):** None (Static content).
- **Writes (Firestore/API):** None.
- **Local State:** 
  - `openIndex` (number | null) inside `FAQ.tsx` for accordion toggling.
  - `isTesting` (boolean), `testProgress` (number), `measuredSpeed` (number | null) inside `PlatformCapabilities.tsx` for the internet speed test.

## 4. Required Components & Exact Texts

- [x] **`Header`** (`src/components/Header.tsx`)
  - Navigation links: "Games" (`/#games`), "Pricing" (`/#pricing`), "FAQ" (`/#faq`).
  - CTA Buttons: "Log In" (transparent), "Sign Up" (white pill).

- [x] **`Hero`** (`src/components/Hero.tsx`)
  - Title: "The Future of Gaming is Here"
  - Subtitle: "Play high-end games without a high-end gaming device."
  - Buttons: "Start Playing" (white pill), "View Games" (outline pill).

- [x] **`WhyGenjutsu`** (`src/components/WhyGenjutsu.tsx`)
  - Features Grid:
    1. Title: "No Gaming Hardware Required"
       Description: "Experience high-performance gaming without having to buy expensive hardware."
    2. Title: "Bring Your Own Game"
       Description: "Connect your Steam, Epic Games, or Xbox accounts to play the games you already own."
    3. Title: "Instant Access"
       Description: "Jump straight into our library of pre-installed, Heavy AAA games. No massive downloads or updates required."

- [x] **`PlatformCapabilities`** (`src/components/PlatformCapabilities.tsx`)
  - Title: "Pro-Grade Performance"
  - Content Block 1 (Speed Test): "Internet Speed Test", "Test your connection to our nearest edge server." Test runs via a real 20-second payload loop.
  - Content Block 2 (Hardware): "Hardware Rental", "Rent a dedicated cloud gaming rig for your own projects." Specs: RTX 4080 equivalent, Ray Tracing enabled, Zero latency pipeline. Button: "Join Waitlist".
  - Content Block 3 (Broadcasting): "Direct Broadcasting", "Stream directly from our servers to Twitch or YouTube." Perks: Zero performance hit, 4K 60FPS output, Custom overlays. Button: "Join Waitlist".

- [x] **`FeaturedGames`** (`src/components/FeaturedGames.tsx`)
  - Title: "Featured Games"
  - Grid array containing 4 specific game covers.
  - Hover action: Cover image scale 110%, dark gradient overlay, game title translates up, "Play Now" button appears.

- [x] **`Pricing`** (`src/components/Pricing.tsx`)
  - Title: "Simple Gaming Plans"
  - Subtitle: "Pay by the hour."
  - Tiers:
    1. "1080p" - "60 FPS target" - "₹80 / hour"
    2. "1440p" - "60 FPS target" - "₹100 / hour" (Highlight: Popular, pink accent)
    3. "4K" - "60 FPS target" - "₹120 / hour"

- [x] **`FAQ`** (`src/components/FAQ.tsx`)
  - Title: "Frequently Asked Questions"
  - Questions:
    1. What is cloud gaming? (Cloud gaming lets you play games running on powerful remote hardware while the gameplay is streamed to your device.)
    2. How does Genjutsu work? (Genjutsu runs your game on a cloud GPU and streams the gameplay directly to your device.)
    3. Do I need a gaming PC? (No. You only need a supported device and a suitable internet connection.)
    4. Can I use my Steam account? (Yes, for supported titles, you can use your own Steam account (BYOG model).)
    5. Can I use my Epic Games account? (Yes, for supported games available through Epic Games.)
    6. How fast should my internet be? (Your connection should meet the minimum requirement for the selected gaming quality. Higher resolutions require more bandwidth and stability.)
    7. What devices can I use? (Genjutsu is designed for phones, tablets, laptops and desktops.)

- [x] **`Footer`** (`src/components/Footer.tsx`)
  - Brand: "Genjutsu"
  - Links Column: Games, Pricing, FAQ, Support (`mailto:support@genjutsu.com`).
  - Legal Column: Privacy Policy (`/privacy`), Terms of Service (`/terms`).
  - Copyright: "© 2024 Genjutsu Game Arena. All rights reserved."
