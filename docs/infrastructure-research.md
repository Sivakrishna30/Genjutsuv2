# Infrastructure & Architecture Research

## 1. Backend Orchestration Engine
Transition the current Vite React application into a **Full-Stack Express.js + Vite architecture**.
- The Node.js/Express server will expose secured REST APIs (e.g., `/api/provision-instance`).
- When a user clicks "Play", the React frontend calls the backend. The backend verifies the Firebase Auth token, checks subscription status, and calls the GPU provider API to provision a VM. 
- The backend returns the streaming endpoint to the frontend.

## 2. GPU Rental Providers (India / INR Pricing)
Based on current market data for Indian GPU cloud providers that support hourly/minute billing and local payments (UPI):
- **GridShare:** Highly competitive for gaming. RTX 3070 (8GB) ~₹22/hr, RTX 3080 (10GB) ~₹26/hr, RTX 4090 (24GB) ~₹48/hr. Per-second billing.
- **JarvisLabs / AceCloud:** NVIDIA L4 (24GB) starting around ₹41-₹42/hr.
- **E2E Networks:** Enterprise-grade cloud. NVIDIA L4 from ₹49/hr, with steep discounts for monthly reserved instances.

## 3. Consistent Storage Architecture
To avoid downloading 100GB+ games per session, we use a **Decoupled Compute and Storage Architecture**:
- **Game Library Storage (Persistent Network Disks):** The games are installed on high-speed scalable Network Attached Storage (NAS) or Cloud Persistent Block Storage (NVMe SSDs).
- **Dynamic Mounting:** When the backend spins up a GPU instance, the instance instantly mounts the shared persistent game drive over the local network. 
- **User Save Data:** Rely on Steam Cloud/Epic Online Services for automatic cloud saves. If unsupported, the backend zips the local save directory on session end and uploads it to a private user bucket (Firebase Cloud Storage/AWS S3), downloading it for the next session.

## 4. Streaming Protocol & Video Quality Strategy
Cloud gaming cannot use standard buffering (like Netflix or YouTube) because it introduces input lag. To maintain absolute minimum latency:
- **Protocol:** We will use WebRTC (UDP-based) for the video stream. It prioritizes speed over guaranteed packet delivery.
- **Adaptive Bitrate & Resolution (Dynamic Downgrading):** Instead of buffering during poor internet connections, the streaming engine will instantly downgrade the video bitrate and resolution (e.g., dropping from 1080p to 720p, introducing visual artifacts/pixelation) to keep the stream moving in real-time. 
- **FPS Strategy:** 60 FPS is absolutely achievable and is the industry standard for cloud gaming. The stream will target a fixed 60 FPS under good conditions. If network congestion becomes severe, the engine can allow variable FPS (dropping to 30 FPS) to maintain responsiveness before dropping the connection entirely.
