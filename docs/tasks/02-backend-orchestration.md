# Task 02: Backend Orchestration & Express Transition

## Objective
Upgrade the static Vite React app to a Full-Stack Express.js + Vite application to securely orchestrate cloud GPU instances.

## Steps
1. **Express Server Setup:** ✅ Completed
   - Create `server.ts` at the root.
   - Set up Vite middleware for development (`process.env.NODE_ENV !== "production"`).
   - Configure `express.static` for the `dist` folder in production to serve the frontend.
2. **Package Scripts:** ✅ Completed
   - Update `package.json` to include updated scripts for full-stack architecture (`tsx server.ts` for dev, `esbuild` for build).
3. **Secure API Routes:** ✅ Completed
   - Create the `/api/provision-instance` endpoint.
   - Integrate the Firebase Admin SDK to validate Firebase Auth bearer tokens passed from the frontend to ensure only authenticated users can launch GPU instances.
