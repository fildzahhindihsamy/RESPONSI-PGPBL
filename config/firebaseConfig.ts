// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOVT_iCy4XjqMgyVdxE5YNiHSDZJJmYh0",
    authDomain: "reacnative-6e58d.firebaseapp.com",
    databaseURL: "https://reacnative-6e58d-default-rtdb.firebaseio.com",
    projectId: "reacnative-6e58d",
    storageBucket: "reacnative-6e58d.firebasestorage.app",
    messagingSenderId: "571914017319",
    appId: "1:571914017319:web:28f1107088f147d8b94c02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const db = getDatabase(app);

// Initialize Cloud Firestore and export it
export const firestore = getFirestore(app);

// You can also export the app instance if you need it elsewhere
export default app;
