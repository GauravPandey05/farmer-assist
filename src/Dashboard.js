import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      fetchSchemes(parsedData);
    } else {
      navigate("/profile");
    }
  }, []);

  const fetchSchemes = async (userInput) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/recommend-schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });

      const data = await response.json();
      setSchemes(data);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("userData");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Welcome, {userData?.name || "Farmer"}!</h2>
      <p>Land Size: {userData?.landSize} acres</p>
      <p>Income: ₹{userData?.income}</p>
      <p>Aadhaar Available: {userData?.aadhaar_available ? "Yes" : "No"}</p>
      <p>Crops Grown: {userData?.crops?.join(", ") || "Not provided"}</p>

      <h3 className="text-lg font-semibold mt-4">Recommended Schemes:</h3>
      {schemes.length > 0 ? (
        <ul className="mt-2">
          {schemes.map((scheme, index) => (
            <li key={index} className="border p-2 my-2 rounded">
              <strong>{scheme.name}</strong> - {scheme.benefits}
            </li>
          ))}
        </ul>
      ) : (
        <p>No schemes found matching your profile.</p>
      )}

      <button
        onClick={() => navigate("/register", { state: { update: true } })}
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Update Profile
      </button>


    </div>
  );
};

export default Dashboard;
