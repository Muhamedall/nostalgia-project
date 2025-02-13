"use client";

import { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/features/authSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import InputField from "../InputField";

export default function SignUpPage({ toggleForm }: { toggleForm: () => void }) {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    const confirmPassword = confirmPasswordRef.current?.value ?? "";
    

    // Reset errors
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Validate inputs
    let isValid = true;

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!isValid) return;

    // Dispatch the registerUser action
    dispatch(
      registerUser({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      })
    )
      .unwrap()
      .then(() => {
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
        setAlertMessage("Registration successful!");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
     
       
      })
      .catch(() => {
        setAlertMessage("Registration failed. Please try again.");
        setAlertType("error");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
      });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Alert Message */}
      {showAlert && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white animate-fade-in ${
            alertType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alertMessage}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Join us</h2>

      {/* Name Input */}
      <InputField
        id="name"
        label="Name"
        type="text"
        placeholder="Enter your name"
        ref={nameRef}
      />
      {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}

      {/* Email Input */}
      <InputField
        id="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        ref={emailRef}
      />
      {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

      {/* Password Input */}
      <InputField
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        ref={passwordRef}
      />
      {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}

      {/* Confirm Password Input */}
      <InputField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        ref={confirmPasswordRef}
      />
      {confirmPasswordError && (
        <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
      )}

      {/* Sign Up Button */}
      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>

      {/* Divider */}
      <div className="mt-6 flex items-center justify-center">
        <div className="w-full border-t border-gray-300"></div>
        <span className="px-2 text-gray-500 bg-white text-sm">or</span>
        <div className="w-full border-t border-gray-300"></div>
      </div>

      {/* Social Login Buttons */}
      <div className="mt-6 space-y-4">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <FaFacebook className="w-5 h-5 text-blue-600" />
          <span>Continue with Facebook</span>
        </button>
      </div>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={toggleForm}
            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none"
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  );
}