import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "../context/AlertContext";
import SignUp from "../components/Auth/SignUp";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </AuthProvider>
  );
}

export default MyApp;
