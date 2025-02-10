import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
        navigate(profileSnap.exists() ? "/dashboard" : "/profile");
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <Routes>
      {user ? (
        profileExists ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          <Route path="/profile" element={<Profile user={user} />} />
        )
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthHandler />
    </Router>
  );
}
