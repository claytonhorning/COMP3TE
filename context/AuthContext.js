import React, { createContext, useContext, useEffect, useState } from "react";
import { app, database } from "../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const googleProvider = new GoogleAuthProvider();
  const facebookAuthProvider = new FacebookAuthProvider();

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signupGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function signupFacebook() {
    return signInWithPopup(auth, googleProvider);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signup, signupGoogle, signupFacebook };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
