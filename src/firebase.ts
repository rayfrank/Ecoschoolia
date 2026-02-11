// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBXKbWjQ2dztBAFvC_y8FwgCkf1yrjOeZw",
    authDomain: "echoschoolai.firebaseapp.com",
    projectId: "echoschoolai",
    storageBucket: "echoschoolai.firebasestorage.app",
    messagingSenderId: "1055501488771",
    appId: "1:1055501488771:web:1f8fcc86218ad0012841b6",
    measurementId: "G-1Z234571J1"
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
