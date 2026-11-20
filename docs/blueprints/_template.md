# Blueprint: [Page / Feature Name]

## 1. Purpose
[Explain what this page/component does and the primary user goal.]

## 2. UI & Layout Rules (Genjutsu Design System)
*Based on the existing scaffolding in `PLAN.md` and `App.tsx`.*
- **Base Theme:** Dark mode default (`bg-neutral-950 text-neutral-50`).
- **Accent Colors:** Neon Crimson (e.g., `text-red-500` / `bg-red-600`), Electric Cyan (e.g., `text-cyan-400`).
- **Typography:** High-tech/gaming display fonts for headings (like Orbitron), clean sans-serif for body (Inter/Roboto).
- **Layout Structure:** Full-width sections. Content must be constrained using `max-w-7xl mx-auto`. Generous vertical padding between sections (e.g., `py-20` or `py-24`).
- **Universal Responsiveness:** All layouts MUST scale fluidly across all devices (phones, tablets, laptops). Never use fixed pixel dimensions (e.g., `w-[500px]`). Use `w-full` with dynamic max-widths (`max-w-7xl`). Use responsive padding (e.g., `px-4 md:px-8 lg:px-12`) instead of static spacing or fixed bordering.
- **Component Styling:** 
  - Avoid nested cards.
  - Use subtle borders (`border-neutral-800` or `border-neutral-800/50`).
  - Use background images (like `kumo_kanji_background`) with heavy dark overlays (`bg-black/80`) to ensure text readability.
  - Interactive elements (buttons) should have hover states (e.g., `hover:bg-red-700 transition-colors`).

## 3. Data Dependencies
- **Reads (Firestore/API):** [List collections or endpoints this reads from]
- **Writes (Firestore/API):** [List collections or endpoints this writes to]
- **Local State:** [List required React state variables, e.g., `isOpen`, `isLoading`]

## 4. Required Components
- [ ] `ComponentName` (Purpose and location...)
- [ ] `AnotherComponent` (Purpose and location...)
