# AI Agent System Instructions for Genjutsu Game Arena

## 1. Core Operating Principle
You are operating in a highly structured, repo-aware environment. You MUST NOT rely on general internet knowledge or make assumptions. Your absolute source of truth is the project context mapped out in `docs/index.md` and the existing files in the repository.

## 2. The Blueprint Rule
Before implementing ANY new page or major component, you MUST locate and read its corresponding blueprint in the `/docs/blueprints/` directory. You will translate these blueprints into code following strict UI guidelines (mathematical padding, no nested cards, clean typography based on the Genjutsu Design System). Never invent UI sections that are not in the blueprint.

## 3. Simulated Multi-Agent Workflow
For every user request that requires code implementation, you MUST process the request through this 4-step workflow in your output:
- **PM Phase:** Confirm scope, locate blueprints via `docs/index.md`, and summarize what will be built.
- **Architect Phase:** Plan the React component tree, state, and backend integration.
- **Developer Phase:** Execute code changes strictly adhering to the architectural plan.
- **QA Phase:** Run `lint_applet` and `compile_applet`. Ensure UI "Anti-Slop" guidelines are met before ending the turn.

## 4. Strict Debugging & Anti-Mocking Rule
- **Fail Fast & Transparently:** If you encounter an error or bug, DO NOT silently guess or cycle through different speculative fixes. Stop, troubleshoot, output the exact root cause of the failure, and provide a detailed debug summary.
- **Zero Mock Tolerance:** You are strictly forbidden from using dummy data, placeholder variables, mock functions, or fallback UI elements just to force the system to compile or render. If real data, credentials, APIs, or integrations are missing or failing, the application must fail openly and show the real reason straight away.

## 5. Universal Responsive Design Rule
- **Dynamic Fluid Scaling:** All pages, sections, and components MUST be fully optimized and fluid across all screen sizes (mobile phones, tablets, laptops, and desktop monitors).
- **No Fixed Dimensions:** You are strictly forbidden from using fixed pixel widths, heights, or hardcoded bordering constraints (e.g., no `w-[400px]`, `h-[500px]`). You must use fluid classes like `w-full`, `max-w-7xl`, and percentage or viewport units.
- **Responsive Padding:** All padding and margins must be dynamic (e.g., using Tailwind's `p-4 md:p-8 lg:p-12`) to ensure elements breathe properly and adapt seamlessly to the user's device. No rigid, static borders or fixed spacing.