// src/auth/AuthContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    type User,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Role = "learner" | "teacher";

export interface AppUser {
    firebaseUser: User;
    role: Role;
    displayName?: string | null;
}

interface AuthContextValue {
    user: AppUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (opts: {
        name: string;
        email: string;
        password: string;
        role: Role;
    }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            console.warn("Auth not initialized. Creating mock fallback or staying logged out.");
            setLoading(false);
            return;
        }

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Get role + profile from Firestore with timeout
            // If Firestore is slow/blocked, we shouldn't block login
            let role: Role = "learner";
            let displayName = firebaseUser.displayName;

            const ref = doc(db, "users", firebaseUser.uid);

            try {
                // Race getDoc against a 1s timeout
                const snap: any = await Promise.race([
                    getDoc(ref),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Firestore timeout")), 1000)
                    )
                ]);

                if (snap && snap.exists()) {
                    const data = snap.data() as { role?: Role; name?: string };
                    if (data.role) role = data.role;
                    if (data.name) displayName = data.name;
                }
            } catch (e) {
                console.warn("Profile fetch skipped/failed (using default role):", e);
            }

            setUser({ firebaseUser, role, displayName });
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const login = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Don't setLoading(false) here! 
            // Wait for onAuthStateChanged to update the user and unset loading.
        } catch (error) {
            console.error("Login failed:", error);
            setLoading(false);
            throw error;
        }
    };

    const signup = async ({
        name,
        email,
        password,
        role,
    }: {
        name: string;
        email: string;
        password: string;
        role: Role;
    }) => {
        if (!auth) throw new Error("Firebase Auth not initialized");
        setLoading(true);
        console.log("Starting signup process...");

        try {
            // 1. Create Auth User
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Auth user created:", cred.user.uid);

            // 2. Update Profile
            if (name) {
                await updateProfile(cred.user, { displayName: name });
            }

            // 3. Create Firestore Doc
            // Note: If this fails (e.g. permission denied), the user is still created in Auth.
            // We should handle that gracefully.
            const ref = doc(db, "users", cred.user.uid);
            try {
                await setDoc(ref, { name, role });
                console.log("Firestore profile created");
            } catch (firestoreError: any) {
                console.error("Firestore creation failed:", firestoreError);
                // Optional: We could throw here if we want to force failure,
                // but usually it's better to let the user in and retry profile creation later.
                console.warn("Continuing despite Firestore error. User might have limited access.");
            }

            // Force refresh of user state to ensure profile info is picked up
            // setUser({ firebaseUser: cred.user, role, displayName: name }); 

        } catch (error: any) {
            console.error("Signup error:", error);
            throw error; // Re-throw to be caught by UI
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (!auth) return;
        await signOut(auth);
    };

    const value: AuthContextValue = {
        user,
        loading,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
