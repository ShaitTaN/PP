import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgbzu3hHjH3Lta9V9lADsqXkOkZDlgKA8",
  authDomain: "production-practice-1e3bf.firebaseapp.com",
  projectId: "production-practice-1e3bf",
  storageBucket: "production-practice-1e3bf.appspot.com",
  messagingSenderId: "92919329456",
  appId: "1:92919329456:web:e0f16136bac13467244175",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);