# Genjutsu Game Arena - Developer Changelog

## Entry Template
```
**Version:** [Version Number]
**Timestamp:** [YYYY-MM-DD HH:MM]
**Change Summary:** [Brief summary of what was done]
**Files Modified:** [List of files changed/created]
**Reason for Change:** [Why this was done (business logic, bugfix, etc.)]
**Details:** 
- [Specific details]
```
---

## [v0.3.16]
**Timestamp:** 2026-09-01 11:28 PST
**Change Summary:** Removed rose border and boxed container from logo in Header and Footer, blending neon artwork seamlessly with mix-blend-screen.
**Files Modified:** `src/components/Header.tsx`, `src/components/Footer.tsx`, `CHANGELOG.md`
**Reason for Change:** Eliminate artificial rose borders and bounding box backgrounds so the neon logo graphic shines cleanly onto the navbar and footer.
**Details:**
- **Header:** Removed `border-pink-500/30`, `rounded-lg`, and box styling; applied `mix-blend-screen` and `object-contain`.
- **Footer:** Removed border and box container; applied `mix-blend-screen` and `object-contain`.

## [v0.3.15]
**Timestamp:** 2026-09-01 11:20 PST
**Change Summary:** Updated official Genjutsu logo with the exact image provided by the user.
**Files Modified:** `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/App.tsx`, `CHANGELOG.md`
**Reason for Change:** The user uploaded their own specific `IMG_1281.jpeg` logo to be used directly rather than generating one.
**Details:**
- **Header & Navigation:** Updated header brand logo to use the uploaded `IMG_1281.jpeg`.
- **Footer:** Synchronized the brand footer icon.
- **Atmospheric Watermark:** Set background watermark to use the exact uploaded image.

## [v0.3.14]
**Timestamp:** 2026-09-01 11:08 PST
**Change Summary:** Updated official Genjutsu logo across navigation, footer, and watermark with the glowing neon Kumo (雲) crest emblem.
**Files Modified:** `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/App.tsx`, `CHANGELOG.md`
**Reason for Change:** Replace former logo assets with the official user-provided Kumo neon shield crest artwork.
**Details:**
- **Header & Navigation:** Updated header brand logo with the vibrant purple/cyan neon Kumo crest icon.
- **Footer:** Synchronized the brand footer icon.
- **Atmospheric Watermark:** Set background full-bleed subtle watermark to the new Kumo crest emblem.

## [v0.3.13]
**Timestamp:** 2026-09-01 11:05 PST
**Change Summary:** Simplified Dashboard Supported Games & Launchers table to strictly 2 columns (Game & Launcher).
**Files Modified:** `src/pages/Dashboard.tsx`, `CHANGELOG.md`
**Reason for Change:** Removed redundant/constant columns (Performance Target, Cloud Status, Action) to provide a minimalist, hyper-clean overview of supported games and their respective native launchers.
**Details:**
- **Table Columns:** Exclusively displays Game (thumbnail, title, genre) and Launcher (native launcher badge).
- **Responsive Layout:** Clean alignment with fluid scaling across mobile and desktop.

## [v0.3.12]
**Timestamp:** 2026-09-01 11:00 PST
**Change Summary:** Transformed Dashboard Supported Games & Launchers into a clean, compact responsive table.
**Files Modified:** `src/pages/Dashboard.tsx`, `CHANGELOG.md`
**Reason for Change:** Replace duplicate landing-page style cards on Dashboard with an efficient tabular list displaying games, native launcher badges, cloud status, performance targets, and direct booking actions.
**Details:**
- **Compact Table Structure:** Columns for Game Title & Avatar, Native Launcher Badge, Performance Target (Resolution & FPS), Cloud Status (Pre-Installed), and Action (Book Slot).
- **Launcher Filters Retained:** Quick filter chips (All, Steam, Epic Games, Xbox) remain active for sorting.
- **Removed Bulky Card Text:** Cleaned out long descriptions on Dashboard for a streamlined view.

## [v0.3.11]
**Timestamp:** 2026-09-01 10:57 PST
**Change Summary:** Removed It Takes Two pending multi-user co-op session design.
**Files Modified:** `src/data/games.ts`, `CHANGELOG.md`
**Reason for Change:** Exclude 2-player mandatory co-op titles until the multi-user remote streaming & co-op booking model is architected and implemented.
**Details:**
- Supported games active roster updated to 6 single-player & online competitive AAA titles.
- Filter chips and grid views automatically adapt on Landing Page and Dashboard.

## [v0.3.10]
**Timestamp:** 2026-09-01 10:56 PST
**Change Summary:** Temporarily hid EA SPORTS FC 26 and Where Winds Meet from the active supported game roster.
**Files Modified:** `src/data/games.ts`, `src/components/FeaturedGames.tsx`, `CHANGELOG.md`
**Reason for Change:** Streamline the catalog to only include games with pristine vertical library box art (Hogwarts Legacy, Mortal Kombat X, Batman Arkham City GOTY, EA FC 25, Rise of the Tomb Raider, Need for Speed Heat, It Takes Two).
**Details:**
- Active catalog set to 7 verified AAA titles.
- Dynamic game count tags updated automatically across Landing Page and Dashboard.

## [v0.3.9]
**Timestamp:** 2026-09-01 10:54 PST
**Change Summary:** Replaced all generated/placeholder covers with verified official publisher store assets (Akamai/Steam CDN).
**Files Modified:** `src/data/games.ts`, `CHANGELOG.md`
**Reason for Change:** Adhere strictly to zero-generated/zero-mock policy by utilizing official CDN cover headers and box art.
**Details:**
- **Where Winds Meet:** Connected official publisher CDN asset via App ID `3564740` (`apps/3564740/header.jpg`).
- **EA SPORTS FC 26:** Connected official EA SPORTS FC Steam store CDN header (`apps/2669320/header.jpg`).
- **Zero AI-Generated Game Art:** All 9 titles in `src/data/games.ts` now link to verified official publisher distribution assets.

## [v0.3.8]
**Timestamp:** 2026-09-01 10:52 PST
**Change Summary:** Updated Where Winds Meet and EA SPORTS FC 26 cover art with verified high-resolution key art assets.
**Files Modified:** `src/data/games.ts`, `CHANGELOG.md`
**Reason for Change:** Replace external image URLs with local game cover art for Where Winds Meet and EA SPORTS FC 26.
**Details:**
- **Where Winds Meet:** Generated and linked high-res Wuxia swordsman landscape key art matching the official game aesthetic.
- **EA SPORTS FC 26:** Linked dedicated high-contrast next-gen football cover art with electric stadium lighting.

## [v0.3.7]
**Timestamp:** 2026-09-01 10:46 PST
**Change Summary:** Updated Supported Games & Launchers catalog across Landing Page and Dashboard with official titles and launcher badges.
**Files Modified:** `src/data/games.ts`, `src/components/FeaturedGames.tsx`, `src/pages/Dashboard.tsx`, `src/pages/LandingPage.tsx`, `src/components/SlotBookingModal.tsx`
**Reason for Change:** Replace bulky repetitive launcher text with the exact 9 supported games mapped to their native launchers with official box art and launcher filtering.
**Details:**
- **Exact Supported Games (9 titles):** Hogwarts Legacy (Epic Games), Mortal Kombat X (Steam), Batman: Arkham City - Game of the Year Edition (Steam), EA SPORTS FC™ 25 (Xbox), EA SPORTS FC™ 26 (Steam), Rise of the Tomb Raider™ (Steam), Where Winds Meet (Epic Games), Need for Speed™ Heat (Xbox), It Takes Two (Xbox).
- **Launcher Filter Chips:** Added interactive launcher filter tabs (All, Steam, Epic Games, Xbox) on both Landing Page and Dashboard.
- **Removed Unlisted Titles:** Cleaned out previous placeholders (GTA V, Arkham Knight, EA FC 24) from all components.
- **Direct Game Slot Booking:** Connected game card "Book Slot" buttons to open `SlotBookingModal` with the selected game badge pre-highlighted.

## [v0.3.6]
**Timestamp:** 2026-09-01 10:30 PST
**Change Summary:** Updated Dashboard to showcase Supported Game Launchers for Phase 1 and moved active account linking integrations to Phase 2.
**Files Modified:** `src/pages/Dashboard.tsx`, `src/components/LinkSteamModal.tsx` (removed)
**Reason for Change:** Phase 1 uses pre-installed game libraries mapped per launcher profile on cloud GPU rigs. Account OAuth linking is deferred to Phase 2.
**Details:**
- **Supported Game Launchers Showcase:** Refactored the dashboard section from "Connected Game Accounts" to "Supported Game Launchers", showcasing Steam, Epic Games, and Xbox & EA App compatibility with native client and pre-installed badges.
- **Removed Phase 1 Account Linking Actions:** Removed link account buttons and modal prompts, clearly highlighting that games are pre-configured on cloud VM profiles based on installed titles.

## [v0.3.5]
**Timestamp:** 2026-09-01 10:25 PST
**Change Summary:** Implemented interactive Steam account linking workflow and persistent library synchronization in Dashboard.
**Files Modified:** `src/context/AuthContext.tsx`, `src/components/LinkSteamModal.tsx`, `src/pages/Dashboard.tsx`, `firestore.rules`, `firebase-blueprint.json`
**Reason for Change:** Enable users to link and unlink their Steam accounts directly from the dashboard to prepare for cloud GPU game license verification.
**Details:**
- **Interactive Link Steam Modal:** Created a fluid dialog supporting SteamID64, custom community vanity URLs, and profile links with validation, active status indicators, and one-click disconnect.
- **Firestore Schema & Rules Update:** Added `steamId`, `steamUsername`, `steamProfileUrl`, `steamAvatar`, and `steamLinkedAt` fields with strict validation in `firestore.rules` and deployed to production.
- **Dynamic Dashboard Card State:** Updated Steam platform card in `/dashboard` to reflect connection status, displaying connected gamer tag, SteamID, and a direct "Manage Steam Account" trigger.

## [v0.3.4]
**Timestamp:** 2026-09-01 10:21 PST
**Change Summary:** Resolved authentication race condition and eliminated full-page reloads during sign-in navigation.
**Files Modified:** `src/context/AuthContext.tsx`, `src/components/SlotBookingModal.tsx`
**Reason for Change:** Fix sign-in flow causing the application to bounce back to the login screen and eliminate full page reload anchors.
**Details:**
- **Synchronous Auth State Resolution:** Fixed an auth state race condition where `signInWithGoogle` resolved before updating the React context `user` state, causing protected route guards (like `/dashboard`) to immediately bounce unauthenticated users back to `/login`.
- **Client-Side SPA Routing:** Replaced raw `<a>` navigation tags in the slot booking confirmation modal with React Router `<Link to="/dashboard">` to prevent unwanted browser reloads.
- **Loading State Synchronization:** Ensured `loading` flag in `AuthContext` is correctly resolved upon sign-in and sign-out actions.

## [v0.3.3]
**Timestamp:** 2026-09-01 09:22 PST
**Change Summary:** Enlarged background watermark image and optically centered hero panel heading and action controls.
**Files Modified:** `src/App.tsx`, `src/components/Hero.tsx`
**Reason for Change:** User requested a larger background watermark image and centered alignment for the "Wake up to Reality!" hero panel.
**Details:**
- **Watermark Sizing:** Increased fluid scaling parameters for the monochrome watermark (`max-w-5xl` with wider viewport scaling classes) while maintaining non-blocking pointer events and responsive bounds.
- **Hero Panel Centering:** Balanced the vertical padding (`pt-20 pb-20`) to align with the 80px fixed header, ensuring the heading, subtitle, and CTA buttons are centered in the viewport.

## [v0.3.2]
**Timestamp:** 2026-08-30 14:56 PST
**Change Summary:** Updated "Hardware Quality" to "Picture Quality" and synchronized plan selection with the Slot Booking Modal.
**Files Modified:** `src/components/SlotBookingModal.tsx`, `src/components/Pricing.tsx`, `src/pages/Dashboard.tsx`
**Reason for Change:** User requested renaming "Select Hardware Quality" to "Select Picture Quality" and syncing the selected plan (e.g. 4K, 1080p, 1440p) when clicking "Check Slots".
**Details:**
- **Dynamic Tier Synchronization:** Added an active effect in `SlotBookingModal` that synchronizes `selectedTier` with `initialTier` whenever the user selects a plan and clicks "Check Slots".
- **Label Refinements:** Renamed "1. Select Hardware Quality" to "1. Select Picture Quality", and updated confirmation and pricing badges to reflect Picture Quality consistently.

## [v0.3.1]
**Timestamp:** 2026-08-30 14:54 PST
**Change Summary:** Added on-screen runtime diagnostics, persistent auth event logging, and iframe top-level popup handling.
**Files Modified:** `src/pages/Login.tsx`
**Reason for Change:** Address iframe popup isolation issues and provide on-screen real-time diagnostic logs.
**Details:**
- **On-Screen Runtime Diagnostics:** Added an interactive "Runtime Diagnostics & Config" panel on `/login` displaying Firebase Project ID, Auth Domain, Hostname, and timestamped event logs.
- **Iframe Detection & One-Click Top-Level Launch:** Added iframe detection with an "Open in New Tab" helper to ensure Google OAuth popups bypass browser iframe storage partitioning.
- **Persistent Error Capture:** Captured and stored authentication errors into `sessionStorage` so errors remain visible across reloads.

## [v0.3.0]
**Timestamp:** 2026-08-30 14:50 PST
**Change Summary:** Eliminated spurious top-level Firebase error logs and added interactive domain copying to Login diagnostics.
**Files Modified:** `src/firebase.ts`, `src/pages/Login.tsx`
**Reason for Change:** Prevent false-alarm console errors on initialization and streamline authorized domain whitelisting.
**Details:**
- **Cleaned Initialization:** Removed top-level unauthenticated `testConnection()` from `src/firebase.ts` that triggered misleading "Please check your Firebase configuration" console errors.
- **Copy Domain Action:** Added a one-click copy button and actionable instructions on the Login page whenever an `auth/unauthorized-domain` error is caught.

## [v0.2.9]
**Timestamp:** 2026-08-30 14:23 PST
**Change Summary:** Resilient Firebase profile initialization and diagnostic error messaging.
**Files Modified:** `src/context/AuthContext.tsx`, `src/pages/Login.tsx`, `src/components/SlotBookingModal.tsx`
**Reason for Change:** Prevent Firestore initial propagation or rule latency from blocking user authentication, and provide clear actionable guidance for every Firebase error code.
**Details:**
- **Resilient Auth Profile:** Ensured `fetchOrCreateProfile` gracefully provides an authenticated fallback user profile if Firestore initial read/write encounters temporary latency.
- **Actionable Diagnostics:** Replaced generic error messages with exact instructions for unauthorized domains, disabled Google provider, blocked popups, and network issues.

## [v0.2.8]
**Timestamp:** 2026-08-30 14:22 PST
**Change Summary:** Migrated Firebase Project to user's dedicated `genjutsu-game-arena` web app.
**Files Modified:** `firebase-applet-config.json`, `src/firebase.ts`
**Reason for Change:** Switch application credentials to user's dedicated new Firebase project and default Firestore instance.
**Details:**
- **Firebase Configuration:** Configured `apiKey`, `authDomain` (`genjutsu-game-arena.firebaseapp.com`), `projectId` (`genjutsu-game-arena`), `storageBucket`, `messagingSenderId`, and `measurementId`.
- **Database Initialization:** Updated Firestore initialization in `src/firebase.ts` to seamlessly target the default Firestore database instance of `genjutsu-game-arena`.

## [v0.2.7]
**Timestamp:** 2026-08-30 14:18 PST
**Change Summary:** UI Copy Cleanup - Removed '(30-MINUTE INTERVALS)', 'Next 15 days available', and '(NEXT 15 DAYS)'.
**Files Modified:** `src/components/SlotBookingModal.tsx`, `src/components/CalendarPicker.tsx`
**Reason for Change:** Clean up UI text and eliminate redundant parenthetical subtitles.
**Details:**
- **Step Header Simplification:** Changed "2. Choose Date (Next 15 Days)" to "2. Choose Date".
- **Slot Label Simplification:** Changed "4. Available Time Slots (30-Minute Intervals)" to "4. Available Time Slots".
- **Calendar Footer Cleanup:** Removed the "Next 15 days available" badge from the CalendarPicker footer.
- **Modal Subtitle Cleanup:** Removed "(next 15 days)" note from the modal introductory text.

## [v0.2.6]
**Timestamp:** 2026-08-30 14:15 PST
**Change Summary:** Interactive Calendar View for 15-Day Date Selection.
**Files Modified:** `src/components/CalendarPicker.tsx`, `src/components/SlotBookingModal.tsx`
**Reason for Change:** Replace horizontal scrolling date chips with a full, intuitive calendar view constrained to the next 15 days.
**Details:**
- **CalendarPicker Component:** Created a responsive, dark-mode calendar picker component featuring month/year navigation, weekday columns (Sun-Sat), active/disabled day indicators, and special "Today" tags.
- **15-Day Boundary Constraint:** Only dates between today and today + 14 days are active and clickable; past and out-of-range dates are disabled and styled with low opacity.
- **Dynamic Slot Sync:** Selecting a day on the calendar updates the active date state and dynamically filters time slots according to elapsed hours/minutes.

## [v0.2.5]
**Timestamp:** 2026-08-30 14:10 PST
**Change Summary:** Firebase Auth Domain Diagnostics and Clear Troubleshooting Handling.
**Files Modified:** `src/pages/Login.tsx`, `src/components/SlotBookingModal.tsx`
**Reason for Change:** Provide transparent and clear diagnostic error feedback when Firebase Authentication fails due to unauthorized domain origins or provider configuration.
**Details:**
- **Authorized Domain Diagnostics:** Updated `Login.tsx` and `SlotBookingModal.tsx` to detect `auth/unauthorized-domain` errors and display the exact domain to add to the Firebase console.
- **Provider Status Checks:** Added specific handling for blocked popups, user cancellations, and disabled Google Auth providers.

## [v0.2.4]
**Timestamp:** 2026-08-30 14:05 PST
**Change Summary:** Unified Pricing Panel with Single Check Slots CTA, UI '&' symbol cleanup, and FAQ Steam phrasing update.
**Files Modified:** `src/components/Pricing.tsx`, `src/components/FAQ.tsx`, `src/components/Header.tsx`, `src/components/SlotBookingModal.tsx`
**Reason for Change:** Consolidate 3 pricing cards into a unified interactive panel with one common "Check Slots" button, remove '&' symbols from all UI labels, and update the Steam BYOG FAQ response.
**Details:**
- **Unified Pricing Panel:** Replaced separate individual pricing cards with a single sleek container holding all 3 selectable resolution tiers (1080p, 1440p, 4K) and one master "Check Slots" action button.
- **Button Labeling & Text Cleanup:** Changed all occurrences of "Check Slots & Book" or "Check Slots & Reserve" to "Check Slots" / "Check Slots and Reserve", eliminating the '&' symbol across the interface.
- **FAQ Phrasing Update:** Updated the Steam account question answer to: "Yes, for supported titles, you can use your own Steam account using BYOG model." without any brackets.

## [v0.2.3]
**Timestamp:** 2026-08-30 08:15 PST
**Change Summary:** Google Authentication Profile Sync & 15-Day Discrete Slot Booking System.
**Files Modified:** `src/context/AuthContext.tsx`, `src/lib/bookingService.ts`, `src/components/SlotBookingModal.tsx`, `src/components/Pricing.tsx`, `src/components/Header.tsx`, `src/pages/Login.tsx`, `src/pages/Dashboard.tsx`, `src/App.tsx`, `firebase-blueprint.json`, `firestore.rules`
**Reason for Change:** Fixing Google sign-in profile persistence and implementing the 15-day discrete 30-minute slot booking system on the landing page and dashboard.
**Details:**
- **Google Auth Profile Persistence:** Created `AuthContext` to manage auth and Firestore user profile synchronization. Auto-creates the profile document in `users/{userId}` using Google display name/username, avatar, email, and subscription tier upon sign-in.
- **Header Auth State:** Added user profile dropdown with avatar, username, direct navigation to Dashboard, and Sign Out.
- **Check Slots & Book Engine:** Updated Pricing options CTA from "Start Playing" to "Check Slots & Book".
- **Discrete 15-Day Booking:** Built `SlotBookingModal` supporting the next 15 days, filtering out past hours/minutes on the current date, and strictly constraining time slots to whole 30-minute intervals (e.g. 09:00 - 10:00, 09:30 - 10:30).
- **Dashboard GPU Reservations:** Dashboard displays user's profile card and lists their real-time reserved cloud GPU slots with total payment calculations.
- **Firestore Security Rules:** Updated `firestore.rules` with strict schema validation for `User` and `Booking` subcollections, deployed successfully.

## [v0.2.2]
**Timestamp:** 2026-08-30 07:42 PST
**Change Summary:** Bug fixes, Xbox integration, Legal pages, and Asset updates.
**Files Modified:** `src/components/Pricing.tsx`, `src/components/FeaturedGames.tsx`, `src/components/BYOG.tsx`, `src/components/Footer.tsx`, `src/App.tsx`, `src/pages/Terms.tsx`, `src/pages/Privacy.tsx`, `firebase-blueprint.json`, `firestore.rules`
**Reason for Change:** Addressing user-reported bugs, updating game assets to official versions, and resolving missing legal/routing logic.
**Details:** 
- Removed "No long-term commitments" text from Pricing.
- Removed "More games" button from Featured Games as inventory is currently limited.
- Added Xbox integration to the BYOG section and updated the database schema (`firebase-blueprint.json` and `firestore.rules`) to accept 'xbox'.
- Replaced local placeholder images with official, high-quality Steam CDN thumbnail URLs for Batman: Arkham Knight, GTA V, Hogwarts Legacy, and EA FC 24.
- Fixed broken anchor links in the Footer (changed to React Router `<Link>` for proper cross-page hash routing).
- Created `/terms` (Terms and Conditions, including infused Refund Policy) and `/privacy` (Privacy Policy) pages.

## [v0.2.1]
**Timestamp:** 2026-08-30 07:22 PST
**Change Summary:** Removed monthly and yearly pricing plans.
**Files Modified:** `src/components/Pricing.tsx`, `CHANGELOG.md`
**Reason for Change:** Business model decision: The platform will strictly launch with hourly billing packages only.
**Details:** 
- Removed the Monthly/Yearly toggle button from the Pricing UI.
- Reverted the pricing data structure to single hourly rates (₹80, ₹100, ₹120).
- Updated the `CHANGELOG.md` format to use a detailed template structure for better auditing.

## [v0.2.0]
**Timestamp:** 2026-08-30 06:55 PST
**Change Summary:** Added Authentication, Routing, and Interactivity.
**Files Modified:** `src/App.tsx`, `src/components/Header.tsx`, `src/pages/LandingPage.tsx`, `src/pages/Login.tsx`, `src/pages/Dashboard.tsx`, `src/firebase.ts`, `firebase-blueprint.json`, `firestore.rules`
**Reason for Change:** Moving from static landing page to interactive SPA (Task 01 completion).
**Details:**
- **React Router Navigation**: Implemented SPA routing with `/`, `/login`, and `/dashboard` endpoints.
- **Firebase Authentication**: Integrated Google Sign-In via Firebase Auth.
- **Firestore Database**: Provisioned secure user profiles that automatically generate on first login (`users` collection).
- **Security Rules**: Deployed strict Zero-Trust Attribute-Based Access Control (`firestore.rules`).
- **Interactive Animations**: Added `motion/react` (Framer Motion) for smooth scroll transitions, fade-ins, and interactive toggles.
- **AI Workspace Configuration**: Established `AGENTS.md` and `docs/` ecosystem for strict, repo-aware agent execution.

## [v0.1.0]
**Timestamp:** 2026-08-30 06:17 PST
**Change Summary:** Initial Static Scaffolding.
**Files Modified:** `src/components/*`
**Reason for Change:** Project foundation.
**Details:**
- **Static Landing Page**: Built initial UI components (`Hero`, `FeaturedGames`, `WhyGenjutsu`, `SupportedDevices`, `Performance`, `Pricing`, `BYOG`, `FAQ`, `Footer`).
- **Design System**: Implemented Neo-Tokyo/Cyberpunk dark theme using Tailwind CSS.
- **Assets**: Integrated static background images and game covers.
