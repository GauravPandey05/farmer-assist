import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

enableIndexedDbPersistence(db)
  .then(() => console.log("Offline mode enabled"))
  .catch((err) => console.error("Failed to enable offline persistence:", err));

const setUpRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => console.log("reCAPTCHA solved!", response),
      "expired-callback": () => console.log("reCAPTCHA expired. Please try again."),
    });
    window.recaptchaVerifier.render();
  }
  return window.recaptchaVerifier;
};

export { auth, db, RecaptchaVerifier, signInWithPhoneNumber, setUpRecaptcha };
export { collection, addDoc, getDoc, doc, updateDoc };
