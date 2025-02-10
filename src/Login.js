import React, { useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const requestOTP = () => {
    if (!phone.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    signInWithPhoneNumber(auth, phone)
      .then((result) => {
        setConfirmationResult(result);
        alert("OTP Sent!");
      })
      .catch((error) => {
        console.error("OTP Error:", error);
        alert("Error sending OTP: " + error.message);
      });
  };

  const verifyOTP = () => {
    if (!confirmationResult) {
      alert("Please request OTP first.");
      return;
    }

    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    confirmationResult
      .confirm(otp)
      .then(async (result) => {
        const user = result.user;
        alert("Login Successful!");

        const userProfileRef = doc(db, "farmers", user.uid);
        const docSnap = await getDoc(userProfileRef);

        if (docSnap.exists()) {
          sessionStorage.setItem("userData", JSON.stringify(docSnap.data()));
          navigate("/dashboard");
        } else {
          navigate("/register");
        }
      })
      .catch(() => alert("Invalid OTP"));
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Farmer Login</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 rounded w-full my-2"
      />
      <button onClick={requestOTP} className="px-4 py-2 bg-blue-500 text-white rounded">
        Get OTP
      </button>

      {confirmationResult && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded w-full my-2"
          />
          <button onClick={verifyOTP} className="px-4 py-2 bg-green-500 text-white rounded">
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
