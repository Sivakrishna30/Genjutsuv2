# Genjutsu Game Arena - Master Index

## Project Context
**Genjutsu Game Arena** is a real business building a full-stack cloud gaming platform. The platform allows users to stream high-performance AAA games instantly on any device without expensive hardware.

## Quick Links
- **[Changelog](../CHANGELOG.md)**: The developer log tracking versions, new features, and architectural changes.
- **[Project Discovery Document](./discovery.md)**: The foundational understanding of the business, tech stack, and current state.
- **[Original Landing Page Plan](../PLAN.md)**: The initial design and feature breakdown for the landing page.

## Architecture
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, `motion/react` (animations).
- **Backend/Data (Phase 1):** Firebase Auth & Firestore (Accounts, Subscriptions, BYOG library).
- **Backend/Infrastructure (Phase 2):** Full-stack Express.js server for cloud game instance orchestration via container port 3000 mapping.

## Documentation & Research
- **[Infrastructure & Architecture Research](./infrastructure-research.md)**: Research on Backend Orchestration, GPU Providers, and Storage.

## Repository Map
- `/docs/blueprints/`: Contains the UI and data blueprints for every page. [See Template](./blueprints/_template.md)
- `/docs/tasks/`: Contains active and completed task decomposition documents.
  - [01-auth-and-routing.md](./tasks/01-auth-and-routing.md) - ✅ Completed
  - [02-backend-orchestration.md](./tasks/02-backend-orchestration.md) - ⏳ Pending
  - [03-infrastructure-integration.md](./tasks/03-infrastructure-integration.md) - ⏳ Pending
