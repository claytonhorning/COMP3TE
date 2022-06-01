import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import SignUp from "../Auth/SignUp";

const withAuth = (Component) => {
  const Auth = (props) => {
    // Login data added to props via redux-store (or use react context for example)
    const { currentUser } = useAuth();
    const { router } = useRouter();

    // If user is not logged in, return login component
    if (currentUser === (null || undefined)) {
      console.log("npt sogmed in");
      router.push("/signup");
      return <SignUp />;
    }

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
