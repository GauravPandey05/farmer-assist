import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate, useLocation } from "react-router-dom";

const indianStatesAndUTs = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
];

const Register = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdateMode = location.state?.update || false;

  const [name, setName] = useState("");
  const [landSize, setLandSize] = useState("");
  const [crops, setCrops] = useState("");
  const [income, setIncome] = useState("");
  const [aadhaarAvailable, setAadhaarAvailable] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isGovtEmployee, setIsGovtEmployee] = useState(false);
  const [state, setState] = useState("");

  useEffect(() => {
    if (isUpdateMode && user) {
      const fetchUserProfile = async () => {
        const userProfileRef = doc(db, "farmers", user.uid);
        const docSnap = await getDoc(userProfileRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setLandSize(data.landSize || "");
          setCrops(data.crops ? data.crops.join(", ") : "");
          setIncome(data.income || "");
          setAadhaarAvailable(data.aadhaar_available || false);
          setAadhaarNumber(data.aadhaar_number || "");
          setIsGovtEmployee(data.is_govt_employee || false);
          setState(data.state || "");
        }
      };
      fetchUserProfile();
    }
  }, [isUpdateMode, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("User not logged in");
      return;
    }

    if (aadhaarAvailable && !/^\d{12}$/.test(aadhaarNumber)) {
      alert("Aadhaar number must be exactly 12 digits.");
      return;
    }

    const userProfile = {
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
    };

    try {
      await setDoc(doc(db, "farmers", user.uid), userProfile);
      sessionStorage.setItem("userData", JSON.stringify(userProfile));
      alert(isUpdateMode ? "Profile Updated!" : "Profile Saved!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Try again.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (!user) return <p className="text-center text-red-500">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold">{isUpdateMode ? "Update Your Profile" : "Complete Your Profile"}</h2>

      <input type="text" placeholder="Full Name" className="border p-2 rounded w-full my-2"
        value={name} onChange={(e) => setName(e.target.value)} required />

      <input type="number" placeholder="Land Size (in acres)" className="border p-2 rounded w-full my-2"
        value={landSize} onChange={(e) => setLandSize(e.target.value)} required />

      <input type="text" placeholder="Crops Grown (comma-separated)" className="border p-2 rounded w-full my-2"
        value={crops} onChange={(e) => setCrops(e.target.value)} required />

      <input type="number" placeholder="Annual Income (₹)" className="border p-2 rounded w-full my-2"
        value={income} onChange={(e) => setIncome(e.target.value)} required />

      <select className="border p-2 rounded w-full my-2" value={state} onChange={(e) => setState(e.target.value)} required>
        <option value="">Select State/UT</option>
        {indianStatesAndUTs.map((stateName, index) => (
          <option key={index} value={stateName}>{stateName}</option>
        ))}
      </select>

      <label className="flex items-center space-x-2 my-2">
        <input type="checkbox" checked={aadhaarAvailable} onChange={() => setAadhaarAvailable(!aadhaarAvailable)} />
        <span>Aadhaar Available</span>
      </label>

      {aadhaarAvailable && (
        <input type="text" placeholder="Enter Aadhaar Number (12 digits)" className="border p-2 rounded w-full my-2"
          value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} required />
      )}

      <label className="flex items-center space-x-2 my-2">
        <input type="checkbox" checked={isGovtEmployee} onChange={() => setIsGovtEmployee(!isGovtEmployee)} />
        <span>Government Employee</span>
      </label>

      <div className="flex justify-between">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {isUpdateMode ? "Update" : "Save"}
        </button>
        {isUpdateMode && (
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default Register;
