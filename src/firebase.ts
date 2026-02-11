// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Safety check
let app: any;
let db: any;
let storage: any;
let auth: any;

try {
    if (!firebaseConfig.apiKey) {
        throw new Error("Missing Firebase Configuration. Check .env file.");
    }
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
} catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Determine if we are in browser to alert
    if (typeof window !== "undefined") {
        console.error("Critical: Firebase config missing. App will not function properly.");
    }
}

export { db, storage, auth };
export default app;
