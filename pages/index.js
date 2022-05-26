import Head from "next/head";
import Image from "next/image";
import { Autocomplete, TextField } from "@mui/material";
import Hero from "../components/LandingPage/Hero";
import HowToPlay from "../components/LandingPage/HowToPlay";
import SignUp from "../components/Auth/SignUp";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../firebaseConfig";
import React, { useEffect } from "react";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div>
      <Hero />
      <HowToPlay />
    </div>
  );
}
