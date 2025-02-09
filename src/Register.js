import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase"; // Ensure Firebase is initialized
const db = getFirestore();

const Register = ({ user }) => {
  const [name, setName] = useState("");
  const [landSize, setLandSize] = useState("");
  const [crops, setCrops] = useState("");
  const [income, setIncome] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await addDoc(collection(db, "farmers"), {
        uid: user.uid,
        name,
        phone: user.phoneNumber || "N/A",
        landSize,
        crops: crops.split(",").map((crop) => crop.trim()), // Trim extra spaces
        income,
      });
      alert("Profile Saved!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Try again.");
    }
  };

  if (!user) return <p className="text-center text-red-500">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold">Complete Your Profile</h2>
      <input type="text" placeholder="Full Name" className="border p-2 rounded w-full my-2" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Land Size (e.g., 5 acres)" className="border p-2 rounded w-full my-2" value={landSize} onChange={(e) => setLandSize(e.target.value)} required />
      <input type="text" placeholder="Crops Grown (comma-separated)" className="border p-2 rounded w-full my-2" value={crops} onChange={(e) => setCrops(e.target.value)} required />
      <input type="text" placeholder="Income Range (e.g., ₹1-5L)" className="border p-2 rounded w-full my-2" value={income} onChange={(e) => setIncome(e.target.value)} required />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
    </form>
  );
};

export default Register;
