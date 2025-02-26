"use client";
import { useRef, useState } from "react";
import { loginUser } from "@/lib/features/authSlice";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from "@/lib/store";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import InputField from "../InputField";

export default function LoginPage({ toggleForm }: { toggleForm: () => void }) {

 
  
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
 
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");


    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
 
      const email = emailRef.current?.value ?? "";
      const password = passwordRef.current?.value ?? "";
  
      
  
      // Reset errors
    
      setEmailError(null);
      setPasswordError(null);
   
  
      // Validate inputs
      let isValid = true;
  
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
  
  
      if (!isValid) return;
  
      // Dispatch the registerUser action
      dispatch(
        loginUser({
         
          email,
          password,
       
        })
      )
        .unwrap()
        .then(() => {
          
          if (emailRef.current) emailRef.current.value = "";
          if (passwordRef.current) passwordRef.current.value = "";
          
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
    <>
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

           <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Connection</h2>

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

      
     

     

     

    
  {/* Sign in Button */}
  <button
        type="submit"
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
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

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={toggleForm}
            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>
      </form>
    </>
  );
}