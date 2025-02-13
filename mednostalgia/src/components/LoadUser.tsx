// src/components/LoadUser.tsx
"use client";

import { useDispatch } from "react-redux";
import { loadUserFromLocalStorage } from "@/redux/features/authSlice";
import { useEffect } from "react";

export default function LoadUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  return null; 
}