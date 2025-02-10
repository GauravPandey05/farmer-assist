import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Dashboard from "./Dashboard";

function AuthHandler() {
  const [user, setUser] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profileRef = doc(db, "farmers", currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        setProfileExists(profileSnap.exists());
      } else {
        setProfileExists(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfileExists(false);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      {user && (
        <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded absolute top-4 right-4">
          Sign Out
        </button>
      )}
      <Routes>
        <Route path="/" element={user ? <Navigate to={profileExists ? "/dashboard" : "/profile"} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={profileExists ? "/dashboard" : "/profile"} /> : <Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthHandler />
    </Router>
  );
}
