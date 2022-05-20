import Head from "next/head";
import Image from "next/image";
import { Autocomplete, TextField } from "@mui/material";
import Hero from "../components/LandingPage/Hero";
import HowToPlay from "../components/LandingPage/HowToPlay";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowToPlay />
    </div>
  );
}
