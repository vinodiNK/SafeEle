// firebase.js (main folder)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC9kB9D7QmXg2l6e1aQrzf43HVJxMiOlSU",
  authDomain: "safeelephant-e6754.firebaseapp.com",
  projectId: "safeelephant-e6754",
  storageBucket: "safeelephant-e6754.firebasestorage.app",
  messagingSenderId: "361238306114",
  appId: "1:361238306114:web:7f8a542470e556746d7cdb",
  measurementId: "G-1STL96P6XT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
