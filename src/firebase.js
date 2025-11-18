// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWogNS7V7BGrlkP1soZNN6eYZJutHxkTU",
  authDomain: "nutri-check-web.firebaseapp.com",
  projectId: "nutri-check-web",
  storageBucket: "nutri-check-web.firebasestorage.app",
  messagingSenderId: "595037164084",
  appId: "1:595037164084:web:4efdd32061a198a1a0b061",
  measurementId: "G-B4000HHR23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);