# Project Discovery & Understanding
*Last Updated: 2026-08-30*

## 1. Business Overview
**Genjutsu Game Arena** is a real-world cloud gaming business. The platform's ultimate aim is to allow gamers to stream high-performance, AAA gaming experiences directly to any of their devices (TVs, laptops, mobile) without requiring expensive local hardware (like gaming PCs or high-end consoles). 

Key value propositions include:
- **BYOG (Bring Your Own Game):** Users can link their existing libraries (Steam, Epic Games).
- **Performance:** High frame rates, low latency (4K at 60fps/120fps targeted).
- **Accessibility:** Play across multiple devices seamlessly.

## 2. Current State of the Repository
The project currently consists of a highly polished frontend scaffolding. 
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS.
- **Pages/Components:** A comprehensive landing page exists, broken down into modular components: `Header`, `Hero`, `WhyGenjutsu`, `SupportedDevices`, `Performance`, `Pricing`, `BYOG`, `FAQ`, and `Footer`.
- **Assets:** High-quality background images (e.g., `kumo_kanji_background_...`) and game covers (Batman, EA FC, GTA V, Hogwarts) are included and utilized.

## 3. Design System & Theming
The visual identity is rooted in a "Neo-Tokyo" / Cyberpunk / High-Tech aesthetic.
- **Colors:** Deep Black backgrounds (`bg-neutral-950`), Cloud White text (`text-neutral-50`), with Neon Crimson and Electric Cyan accents.
- **Layout:** Full-width sections with constrained content wrappers (`max-w-7xl mx-auto`). Clean, minimalist, avoiding "UI slop" (no unnecessary nested cards, strict mathematical padding).
- **Atmosphere:** Uses dark overlays over intricate backgrounds to maintain high text contrast and a premium gaming feel.

## 4. Technical Roadmap
- **Phase 1 (Current/Next): Frontend Interactivity & Auth.** Adding React Router for navigation, `motion` for scroll animations, and Firebase for User Authentication and simple database needs (storing user subscription tiers and BYOG links).
- **Phase 2: Cloud Infrastructure Orchestration.** Transitioning the architecture to a Full-Stack application (Express.js + Vite running on port 3000). The Express backend will be responsible for communicating with cloud providers (GCP/AWS) to orchestrate, provision, and tear down the actual remote game servers when a user hits "Play".
- **Phase 3: Video Streaming/WebRTC.** Integrating the actual low-latency video streaming client into the browser.
