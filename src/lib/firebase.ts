// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBXKbWjQ2dztBAFvC_y8FwgCkf1yrjOeZw",
    authDomain: "echoschoolai.firebaseapp.com",
    projectId: "echoschoolai",
    storageBucket: "echoschoolai.firebasestorage.app",
    messagingSenderId: "1055501488771",
    appId: "1:1055501488771:web:1f8fcc86218ad0012841b6",
    measurementId: "G-1Z234571J1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);