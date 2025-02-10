import { initializeApp } from "firebase/app";
import { enableNetwork, disableNetwork } from "firebase/firestore";
import { 
  getAuth, 
  RecaptchaVerifier,  
  signInWithPhoneNumber  
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDoc, 
  doc,
  updateDoc  
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
const auth = getAuth(app);
const db = getFirestore(app);


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
export { collection, addDoc, getDoc, doc, updateDoc }; 

enableNetwork(db).catch((error) => {
  console.error("Failed to enable Firestore network:", error);
});
