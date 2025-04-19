// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDQ8tKGmVTrHm8IAWkruKnfJDJZxbrQ89k",
  authDomain: "filezone-408b1.firebaseapp.com",
  projectId: "filezone-408b1",
  storageBucket: "filezone-408b1.firebasestorage.app",
  messagingSenderId: "601699373538",
  appId: "1:601699373538:web:0fc2a2843d9b991fdce9bb",
  measurementId: "G-0RW2WLBN2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);