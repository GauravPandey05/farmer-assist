// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  RecaptchaVerifier,  // ✅ Import RecaptchaVerifier
  signInWithPhoneNumber  // ✅ Import signInWithPhoneNumber
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDoc, 
  doc 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVDAJ6YB1AG9ZbBeN--eM8LBysDHUoR9U",
  authDomain: "farmer-assist-6371c.firebaseapp.com",
  projectId: "farmer-assist-6371c",
  storageBucket: "farmer-assist-6371c.firebasestorage.app",
  messagingSenderId: "220183276378",
  appId: "1:220183276378:web:31bce99634e337ce4da163",
  measurementId: "G-R67JDXQWLV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Function to setup reCAPTCHA
const setUpRecaptcha = (number) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: (response) => {
      console.log("reCAPTCHA solved!", response);
    },
    "expired-callback": () => {
      console.log("reCAPTCHA expired. Please solve again.");
    }
  });
  return window.recaptchaVerifier;
};

// ✅ Export modules properly
export { auth, db, RecaptchaVerifier, signInWithPhoneNumber, setUpRecaptcha };
export { collection, addDoc, getDoc, doc };
