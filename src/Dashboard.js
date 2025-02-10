import React from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Welcome to the Farmer Dashboard</h2>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
