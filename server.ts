import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getAuth, DecodedIdToken } from "firebase-admin/auth";

// Lazy initialization of Firebase Admin to prevent startup crashes
let firebaseAdminApp: App | null = null;
function getFirebaseAdmin() {
  if (!firebaseAdminApp && getApps().length === 0) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        firebaseAdminApp = initializeApp({
          credential: cert(serviceAccount)
        });
      } else {
        firebaseAdminApp = initializeApp();
      }
    } catch (error) {
      console.error("Firebase Admin initialization failed:", error);
    }
  }
  return getAuth(firebaseAdminApp!);
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
  }

  const token = authHeader.split("Bearer ")[1];
  
  try {
    const auth = getFirebaseAdmin();
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // API Routes (Task 02)
  // Protected with requireAuth middleware
  app.post("/api/provision-instance", requireAuth, async (req, res) => {
    const userId = req.user?.uid;
    // TODO: Verify user subscription tier in Firestore
    // TODO: Integrate with GPU provider API (Task 03)
    
    res.json({
      status: "pending",
      message: `Instance provisioning initialized for user: ${userId}`,
      endpoint: null
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
