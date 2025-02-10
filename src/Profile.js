import React, { useState, useEffect } from "react";
import { db, auth, doc, getDoc, updateDoc } from "../firebase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", landSize: "", crops: "", income: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "farmers", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setFormData({ 
            name: userDoc.data().name, 
            landSize: userDoc.data().landSize, 
            crops: userDoc.data().crops.join(", "), 
            income: userDoc.data().income 
          });
        } else {
          navigate("/register");
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdate = async () => {
    const user = auth.currentUser;
    await updateDoc(doc(db, "farmers", user.uid), { 
      name: formData.name, 
      landSize: formData.landSize, 
      crops: formData.crops.split(",").map(crop => crop.trim()), 
      income: formData.income 
    });
    alert("Profile Updated!");
    setUserData(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">User Profile</h2>
      {userData && !isEditing ? (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Land Size:</strong> {userData.landSize} acres</p>
          <p><strong>Crops:</strong> {userData.crops.join(", ")}</p>
          <p><strong>Income:</strong> {userData.income}</p>
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded mt-3">Edit Profile</button>
        </div>
      ) : (
        <div>
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded w-full my-2" />
          <input type="text" placeholder="Land Size" value={formData.landSize} onChange={(e) => setFormData({ ...formData, landSize: e.target.value })} className="border p-2 rounded w-full my-2" />
          <input type="text" placeholder="Crops Grown (comma-separated)" value={formData.crops} onChange={(e) => setFormData({ ...formData, crops: e.target.value })} className="border p-2 rounded w-full my-2" />
          <input type="text" placeholder="Income Range" value={formData.income} onChange={(e) => setFormData({ ...formData, income: e.target.value })} className="border p-2 rounded w-full my-2" />
          <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded mt-3">Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
