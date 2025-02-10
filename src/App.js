import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profileRef = doc(db, "farmers", currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        setProfileExists(profileSnap.exists());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => alert("Logged out successfully!"))
      .catch((error) => console.error("Logout Error:", error));
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <Router>
      <div className="App">
        {user ? (
          profileExists ? (
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="*" element={<Navigate to="/profile" />} />
            </Routes>
          )
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}

        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </Router>
  );
}


export default App;
