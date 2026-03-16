import React, { useEffect, useState, type ReactNode } from "react";
import type { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { DEMO_USER_KEY } from "../lib/demoData";
import { AuthContext } from "./context";
import type { AppUser, Role, SignupOptions } from "./types";

const buildDemoUser = (name: string, email: string, role: Role): AppUser => ({
  firebaseUser: {
    uid: `demo-${role}-${email}`,
    email,
    displayName: name,
  },
  role,
  displayName: name,
});

const saveDemoUser = (user: AppUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(DEMO_USER_KEY);
    return;
  }

  window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
};

const loadDemoUser = (): AppUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(DEMO_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    window.localStorage.removeItem(DEMO_USER_KEY);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(loadDemoUser());
  const [loading, setLoading] = useState(Boolean(auth) && !loadDemoUser());

  useEffect(() => {
    if (!auth) {
      return;
    }

    let unsubscribeProfile: (() => void) | undefined;
    const authLoadTimeout = window.setTimeout(() => {
      setLoading(false);
    }, 2500);

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        window.clearTimeout(authLoadTimeout);
        unsubscribeProfile?.();
        unsubscribeProfile = undefined;

        if (!firebaseUser) {
          setLoading(false);
          return;
        }

        if (!db) {
          const fallbackUser = {
            firebaseUser: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            },
            role: "teacher" as Role,
            displayName: firebaseUser.displayName,
          };
          setUser(fallbackUser);
          saveDemoUser(fallbackUser);
          setLoading(false);
          return;
        }

        unsubscribeProfile = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          (snapshot) => {
            const data = snapshot.data() as { role?: Role; name?: string } | undefined;
            const liveUser: AppUser = {
              firebaseUser: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
              },
              role: data?.role ?? "teacher",
              displayName: data?.name ?? firebaseUser.displayName,
            };
            setUser(liveUser);
            saveDemoUser(liveUser);
            setLoading(false);
          },
          () => {
            const fallbackUser = {
              firebaseUser: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
              },
              role: "teacher" as Role,
              displayName: firebaseUser.displayName,
            };
            setUser(fallbackUser);
            saveDemoUser(fallbackUser);
            setLoading(false);
          }
        );
      },
      () => {
        window.clearTimeout(authLoadTimeout);
        setLoading(false);
      }
    );

    return () => {
      window.clearTimeout(authLoadTimeout);
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const isDemoTeacher = normalizedEmail === "teacher@ecoschoolia.demo";
    const isDemoLearner = normalizedEmail === "learner@ecoschoolia.demo";

    if (isDemoTeacher || isDemoLearner || !auth) {
      const demoUser = buildDemoUser(
        isDemoTeacher ? "Madam Wanjiru" : "Amani",
        normalizedEmail || "teacher@ecoschoolia.demo",
        isDemoTeacher ? "teacher" : "learner"
      );
      setUser(demoUser);
      saveDemoUser(demoUser);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async ({ name, email, password, role }: SignupOptions) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!auth || normalizedEmail.endsWith(".demo")) {
      const demoUser = buildDemoUser(name || "Demo User", normalizedEmail, role);
      setUser(demoUser);
      saveDemoUser(demoUser);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(credentials.user, { displayName: name });
      }
      if (db) {
        try {
          await setDoc(doc(db, "users", credentials.user.uid), { name, role });
        } catch (error) {
          const firestoreError = error as FirebaseError;
          console.error("Firestore profile creation failed:", firestoreError.message);
        }
      }
    } catch {
      const demoUser = buildDemoUser(name || "Demo User", normalizedEmail, role);
      setUser(demoUser);
      saveDemoUser(demoUser);
      setLoading(false);
    }
  };

  const logout = async () => {
    saveDemoUser(null);
    setUser(null);
    setLoading(false);
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
