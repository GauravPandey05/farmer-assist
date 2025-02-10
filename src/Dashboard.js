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
      fetchSchemes(parsedData); // Fetch schemes based on user profile
    } else {
      navigate("/profile"); // Redirect if profile is missing
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
      sessionStorage.removeItem("userData"); // Clear session storage on logout
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

      
    </div>
  );
};

export default Dashboard;
