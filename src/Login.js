import React, { useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved!", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired. Please try again.");
        },
      });
      window.recaptchaVerifier.render();
    }
  };

  const requestOTP = () => {
    if (!phone.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    setUpRecaptcha();

    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
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

        // ✅ Fetch user profile from Firestore
        const userProfileRef = doc(db, "farmers", user.uid);
        const docSnap = await getDoc(userProfileRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          
          // ✅ Store user details in session storage for scheme recommendations
          sessionStorage.setItem("userData", JSON.stringify(userData));

          navigate("/dashboard"); // Redirect to dashboard if profile exists
        } else {
          navigate("/profile"); // Redirect to profile if first-time login
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
      <div id="recaptcha"></div>

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
