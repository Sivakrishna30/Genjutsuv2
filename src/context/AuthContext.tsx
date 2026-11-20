import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, getRedirectResult, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrors";

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string;
  subscriptionTier: "none" | "hourly" | "monthly" | "yearly";
  steamId?: string;
  steamUsername?: string;
  steamProfileUrl?: string;
  steamAvatar?: string;
  steamLinkedAt?: any;
  createdAt?: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  linkSteamAccount: (steamIdentifier: string, vanityName?: string) => Promise<UserProfile>;
  unlinkSteamAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrCreateProfile = async (currentUser: User): Promise<UserProfile> => {
    const userDocPath = `users/${currentUser.uid}`;
    const usernameFromGoogle =
      currentUser.displayName ||
      (currentUser.email ? currentUser.email.split("@")[0] : "Player");

    const fallbackProfile: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email || "",
      username: usernameFromGoogle,
      displayName: currentUser.displayName || usernameFromGoogle,
      photoURL: currentUser.photoURL || "",
      subscriptionTier: "none",
    };

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setProfile(data);
        return data;
      } else {
        await setDoc(userRef, {
          ...fallbackProfile,
          createdAt: serverTimestamp(),
        });

        setProfile(fallbackProfile);
        return fallbackProfile;
      }
    } catch (error) {
      console.warn("Firestore user profile sync error (using local profile):", error);
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  useEffect(() => {
    // Process redirect result if browser fell back to redirect auth
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await fetchOrCreateProfile(result.user);
        }
      })
      .catch((err) => {
        console.warn("Redirect result handler:", err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await fetchOrCreateProfile(currentUser);
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserProfile> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      const userProfile = await fetchOrCreateProfile(result.user);
      setProfile(userProfile);
      setLoading(false);
      return userProfile;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchOrCreateProfile(user);
    }
  };

  const linkSteamAccount = async (steamIdentifier: string, vanityName?: string): Promise<UserProfile> => {
    if (!user) {
      throw new Error("You must be logged in to link a Steam account.");
    }

    const cleanInput = steamIdentifier.trim();
    if (!cleanInput) {
      throw new Error("Please provide a valid Steam ID, custom URL, or Steam Profile link.");
    }

    // Parse Steam ID64 or custom vanity URL
    let extractedId = cleanInput;
    let profileUrl = cleanInput;
    let displayName = vanityName?.trim() || "";

    if (cleanInput.includes("steamcommunity.com/profiles/")) {
      const match = cleanInput.match(/profiles\/([0-9]+)/);
      if (match && match[1]) {
        extractedId = match[1];
        profileUrl = `https://steamcommunity.com/profiles/${extractedId}`;
      }
    } else if (cleanInput.includes("steamcommunity.com/id/")) {
      const match = cleanInput.match(/id\/([a-zA-Z0-9_\-]+)/);
      if (match && match[1]) {
        extractedId = match[1];
        profileUrl = `https://steamcommunity.com/id/${extractedId}`;
        if (!displayName) displayName = extractedId;
      }
    } else if (/^\d{17}$/.test(cleanInput)) {
      extractedId = cleanInput;
      profileUrl = `https://steamcommunity.com/profiles/${extractedId}`;
    } else {
      // Treat as custom vanity name
      profileUrl = `https://steamcommunity.com/id/${cleanInput}`;
      if (!displayName) displayName = cleanInput;
    }

    if (!displayName) {
      displayName = `SteamUser_${extractedId.slice(-4)}`;
    }

    const updatedData = {
      steamId: extractedId,
      steamUsername: displayName,
      steamProfileUrl: profileUrl,
      steamAvatar: `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`,
      steamLinkedAt: new Date().toISOString(),
    };

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, updatedData, { merge: true });

    const newProfile: UserProfile = {
      ...(profile || {
        uid: user.uid,
        email: user.email || "",
        username: user.displayName || "Player",
        displayName: user.displayName || "Player",
        subscriptionTier: "none",
      }),
      ...updatedData,
    };

    setProfile(newProfile);
    return newProfile;
  };

  const unlinkSteamAccount = async (): Promise<void> => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const updatedData = {
      steamId: "",
      steamUsername: "",
      steamProfileUrl: "",
      steamAvatar: "",
      steamLinkedAt: "",
    };
    await setDoc(userRef, updatedData, { merge: true });

    if (profile) {
      setProfile({
        ...profile,
        steamId: undefined,
        steamUsername: undefined,
        steamProfileUrl: undefined,
        steamAvatar: undefined,
        steamLinkedAt: undefined,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        logout,
        refreshProfile,
        linkSteamAccount,
        unlinkSteamAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
