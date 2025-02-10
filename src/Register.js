import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const db = getFirestore();

const Register = ({ user }) => {
  const [name, setName] = useState("");
  const [landSize, setLandSize] = useState("");
  const [crops, setCrops] = useState("");
  const [income, setIncome] = useState("");
  const [aadhaarAvailable, setAadhaarAvailable] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isGovtEmployee, setIsGovtEmployee] = useState(false);
  const [state, setState] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("User not logged in");
      return;
    }

    if (aadhaarAvailable && (!/^\d{12}$/.test(aadhaarNumber))) {
      alert("Aadhaar number must be exactly 12 digits.");
      return;
    }

    try {
      await setDoc(doc(db, "farmers", user.uid), {
        uid: user.uid,
        name,
        phone: user.phoneNumber || "N/A",
        landSize: parseFloat(landSize),
        crops: crops.split(",").map((crop) => crop.trim()),
        income: parseFloat(income),
        aadhaar_available: aadhaarAvailable,
        aadhaar_number: aadhaarAvailable ? aadhaarNumber : null,
        is_govt_employee: isGovtEmployee,
        state,
      });

      alert("Profile Saved!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Try again.");
    }
  };

  if (!user) return <p className="text-center text-red-500">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold">Complete Your Profile</h2>
      
      <input type="text" placeholder="Full Name" className="border p-2 rounded w-full my-2" 
        value={name} onChange={(e) => setName(e.target.value)} required />

      <input type="number" placeholder="Land Size (in acres)" className="border p-2 rounded w-full my-2" 
        value={landSize} onChange={(e) => setLandSize(e.target.value)} required />

      <input type="text" placeholder="Crops Grown (comma-separated)" className="border p-2 rounded w-full my-2" 
        value={crops} onChange={(e) => setCrops(e.target.value)} required />

      <input type="number" placeholder="Annual Income (₹)" className="border p-2 rounded w-full my-2" 
        value={income} onChange={(e) => setIncome(e.target.value)} required />

      <input type="text" placeholder="State" className="border p-2 rounded w-full my-2" 
        value={state} onChange={(e) => setState(e.target.value)} required />

      <label className="flex items-center space-x-2 my-2">
        <input type="checkbox" checked={aadhaarAvailable} 
          onChange={() => setAadhaarAvailable(!aadhaarAvailable)} />
        <span>Aadhaar Available</span>
      </label>

      {aadhaarAvailable && (
        <input type="text" placeholder="Enter Aadhaar Number (12 digits)" className="border p-2 rounded w-full my-2" 
          value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} required />
      )}

      <label className="flex items-center space-x-2 my-2">
        <input type="checkbox" checked={isGovtEmployee} 
          onChange={() => setIsGovtEmployee(!isGovtEmployee)} />
        <span>Government Employee</span>
      </label>

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Save
      </button>
    </form>
  );
};

export default Register;
