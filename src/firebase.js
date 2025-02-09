import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// API keys for Firebase services are not secret
const firebaseConfig = {
    apiKey: "AIzaSyCDSUtbf1rxi7c2YFB2dWnWk1rFiBJPQr4",
    authDomain: "ks-budgetbuddy.firebaseapp.com",
    projectId: "ks-budgetbuddy",
    storageBucket: "ks-budgetbuddy.firebasestorage.app",
    messagingSenderId: "969878372162",
    appId: "1:969878372162:web:26be7fe6d20eacba47d2db",
    measurementId: "G-8LWHB3WQC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
