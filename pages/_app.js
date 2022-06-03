import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "../context/AlertContext";
import SignUp from "../components/Auth/SignUp";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>COMP3TE</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="COMP3TE" />
        <meta property="og:url" content="https://www.comp3te.com/play" />
        <meta property="og:image" content="/og.png" />
        <meta
          property="og:description"
          content="Win cash by teaming up with your friends in live trivia"
        />
      </Head>
      <AuthProvider>
        <AlertProvider>
          <Component {...pageProps} />
        </AlertProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
