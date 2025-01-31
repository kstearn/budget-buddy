import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
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

async function getData() {
    const coll = collection(db, 'users');
    const snapshot = await getDocs(coll);
    const users = snapshot.docs.map(doc => doc.data());
    return users;
}

async function getUserBudgetCategories(user) {
    const coll = collection(db, `users/${user}/budgetCategories`);
    const snapshot = await getDocs(coll);
    const categories = snapshot.docs.map(doc => doc.data());
    return categories;
}

export { auth, getData, getUserBudgetCategories };
