import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
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

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Enable Firestore Offline Mode
enableIndexedDbPersistence(db)
  .then(() => console.log("Offline mode enabled"))
  .catch((err) => console.error("Failed to enable offline persistence:", err));

// ✅ Export modules properly
export { auth, db, signInWithPhoneNumber };
export { collection, addDoc, getDoc, doc, updateDoc };
