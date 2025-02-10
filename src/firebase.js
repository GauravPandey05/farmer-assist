import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVDAJ6YB1AG9ZbBeN--eM8LBysDHUoR9U",
  authDomain: "farmer-assist-6371c.firebaseapp.com",
  projectId: "farmer-assist-6371c",
  storageBucket: "farmer-assist-6371c.appspot.com",
  messagingSenderId: "220183276378",
  appId: "1:220183276378:web:31bce99634e337ce4da163",
  measurementId: "G-R67JDXQWLV"
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
