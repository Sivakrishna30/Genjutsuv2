# Task 01: Interactivity, Routing & Authentication (COMPLETED)

## Goal
Upgrade the static landing page into an interactive Single Page Application (SPA) and integrate Firebase for user authentication.

## Decomposition (Steps)
- [x] **Step 1: UI Polish & Interactivity**
  - Install and configure `motion` (framer-motion) for smooth scroll transitions and fade-ins on existing landing page components (`Hero`, `WhyGenjutsu`, `Performance`, etc.).
  - Make the `FAQ` accordion interactive (expand/collapse state).
  - Make the `Pricing` toggle interactive (Monthly/Yearly state).
- [x] **Step 2: React Router Setup**
  - Install `react-router` (or `react-router-dom`) and `lucide-react` (for icons).
  - Configure routing in `App.tsx` (`/` for landing, `/login` for auth, `/dashboard` for logged-in users).
- [x] **Step 3: Firebase Integration**
  - Request Firebase provision via the agent tool (`set_up_firebase`).
  - Implement Firebase Auth (Google/Email).
  - Build the `/login` route based on a blueprint.
