import Head from "next/head";
import Image from "next/image";
import { Autocomplete, TextField } from "@mui/material";
import Hero from "../components/LandingPage/Hero";
import HowToPlay from "../components/LandingPage/HowToPlay";
import SignUp from "../components/Auth/SignUp";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { useEffect } from "react";

export default function Home() {
  const { currentUser } = useAuth();
  const docRef = doc(database, "Users", "urJlSud5kwOG4pvgd0G1vSGXMKh1");

  const getData = async () => {
    const user = await getDoc(docRef);

    if (user.exists()) {
      console.log(user.data().team.members);
    }
  };

  getData();

  return (
    <div>
      <Hero />
      <HowToPlay />
    </div>
  );
}
