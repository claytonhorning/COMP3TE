import React, { useEffect, useState, useContext } from "react";
import { getAuth } from "firebase/auth";
import { Modal, Grid, TextField, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { database } from "../firebaseConfig";
import styles from "../styles/Auth/SignUpModal.module.css";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { CircularProgress } from "@mui/material";

export default function Login() {
  const databaseRef = collection(database, "Users");
  const [loading, setLoading] = useState();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const auth = getAuth();

  const { signup, signupGoogle, signupFacebook, loginWithEmail } = useAuth();

  const handleOnChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleLoginWithEmail = () => {
    if (!inputs.email || !inputs.password) {
      handleError("Please enter your email and password.", "email");
    } else {
      setIsLoading(true);
      loginWithEmail(inputs.email, inputs.password)
        .then((res) => {
          router.push("/play");
          setInputs({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
          setErrors({});
        })
        .catch((error) => {
          handleError(error.message, "server");
        });
    }
  };

  const handleSignUpWithGoogle = () => {
    signupGoogle()
      .then((res) => {
        router.push("/play");

        setDoc(
          doc(databaseRef, auth.currentUser.uid),
          {
            name: res.user.displayName,
            email: res.user.email,
            avatar: res.user.photoURL,
            metadata: { ...res.user.metadata },
            role: "user",
          },
          { merge: true }
        );
        setInputs({ firstName: "", lastName: "", email: "", password: "" });
        setErrors({});
      })
      .catch((error) => {
        handleError(error.message, "server");
      });
  };
  const handleSignUpWithFacebook = () => {
    signupFacebook()
      .then((res) => {
        router.push("/play");
        setDoc(
          doc(databaseRef, auth.currentUser.uid),
          {
            name: res.user.displayName,
            email: res.user.email,
            avatar: res.user.photoURL,
            metadata: { ...res.user.metadata },
            role: "user",
          },
          { merge: true }
        );
        setInputs({ firstName: "", lastName: "", email: "", password: "" });
        setErrors({});
        console.log(res);
      })
      .catch((error) => {
        handleError(error.message, "server");
      });
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            backgroundColor: "black",
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              width: "500px",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography mt={3} mb={3} variant="h5">
              Login
            </Typography>
            <Typography
              variant="h4"
              textAlign={"center"}
              mb={3}
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 700,
                letterSpacing: ".3rem",
              }}
            >
              COMP3TE
            </Typography>
            <button
              className={styles.oAuthBtn}
              onClick={handleSignUpWithGoogle}
            >
              <img
                className={styles.oAuthLogo}
                src={"/google-logo.png"}
                width={30}
                height={30}
              ></img>
              Login with Google
            </button>

            <button
              className={styles.oAuthBtn}
              onClick={handleSignUpWithFacebook}
            >
              <img
                className={styles.oAuthLogo}
                src={"/fb-logo.png"}
                width={30}
                height={30}
              ></img>
              Login with Facebook
            </button>

            <div className={styles.line} />
            <div className={styles.orText}>or login using email</div>

            <Grid
              style={{ marginTop: ".5em" }}
              container
              spacing={2}
              direction="column"
              alignItems="center"
            >
              <Grid item>
                <TextField
                  id="email"
                  label="Email"
                  variant="standard"
                  style={{ marginLeft: 15, marginRight: 15 }}
                  name={"email"}
                  value={inputs.email}
                  onChange={(e) => handleOnChange(e)}
                  type="email"
                />
                <TextField
                  id="password"
                  label="Password"
                  variant="standard"
                  style={{ marginLeft: 15, marginRight: 15 }}
                  name={"password"}
                  value={inputs.password}
                  onChange={(e) => handleOnChange(e)}
                  type="password"
                />
              </Grid>
            </Grid>
            <button
              disabled={loading}
              onClick={handleLoginWithEmail}
              className={styles.submitBtn}
            >
              Login
            </button>
            <p className={styles.serverError}>{errors.server}</p>
            <p className={styles.serverError}>{errors.email}</p>
            <Box sx={{ mb: 2.5 }}></Box>
          </Box>
        </Box>
      )}
    </>
  );
}
