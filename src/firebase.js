// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Add this

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0sQW0RNtQJtnuP9ZdsiWiNoh0RAQzeDQ",
  authDomain: "nutri-check-84aa3.firebaseapp.com",
  projectId: "nutri-check-84aa3",
  storageBucket: "nutri-check-84aa3.firebasestorage.app",
  messagingSenderId: "569151160069",
  appId: "1:569151160069:web:d3c7bbbd10280c75b8016c",
  measurementId: "G-ZNHPHC8NQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // Export Firestore