import React from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Welcome to Dashboard</h2>
      <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded mt-3">
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
