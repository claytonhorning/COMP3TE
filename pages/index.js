import Head from "next/head";
import Image from "next/image";
import { Autocomplete, TextField } from "@mui/material";
import Hero from "../components/LandingPage/Hero";
import HowToPlay from "../components/LandingPage/HowToPlay";
import SignUp from "../components/Auth/SignUp";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  return (
    <div>
      <Hero />
      <HowToPlay />
    </div>
  );
}
