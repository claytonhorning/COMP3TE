import React, { useEffect, useState, useContext } from "react";
import { getAuth } from "firebase/auth";
import { Modal, Grid, TextField } from "@mui/material";
import styles from "../../styles/Auth/SignUpModal.module.css";
import { useRouter } from "next/router";
import { app, database } from "../../firebaseConfig";
import { SignUpModalContext } from "../../context/SignUpModalContext";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function SignUp({ open, handleClose }) {
  const { signUpOpen, setSignUpOpen } = useContext(SignUpModalContext);
  const databaseRef = collection(database, "Users");
  const [loading, setLoading] = useState();

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const auth = getAuth();

  const { signup, signupGoogle, signupFacebook } = useAuth();

  const handleOnChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleSignUpWithEmail = () => {
    signup(inputs.email, inputs.password)
      .then((res) => {
        setSignUpOpen(false);
        setDoc(doc(databaseRef, auth.currentUser.uid), {
          name: `${inputs.firstName} ${inputs.lastName}`,
          email: inputs.email,
          friends: {
            sent: [],
            recieved: [],
            accepted: [],
          },
        });
        setInputs({ firstName: "", lastName: "", email: "", password: "" });
        setErrors({});
      })
      .catch((error) => {
        handleError(error.message, "server");
      });
  };

  const handleSignUpWithGoogle = () => {
    signupGoogle()
      .then((res) => {
        setSignUpOpen(false);
        console.log(res);
        setDoc(doc(databaseRef, auth.currentUser.uid), {
          name: res.user.displayName,
          email: res.user.email,
          friends: {
            sent: [],
            recieved: [],
            accepted: [],
          },
        });
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
        setSignUpOpen(false);
        setDoc(doc(databaseRef, auth.currentUser.uid), {
          name: res.user.displayName,
          email: res.user.email,
          friends: {
            sent: [],
            recieved: [],
            accepted: [],
          },
        });
        setInputs({ firstName: "", lastName: "", email: "", password: "" });
        setErrors({});
        console.log(res);
      })
      .catch((error) => {
        handleError(error.message, "server");
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.container}>
        <div className={styles.modalContainer}>
          <h2 className={styles.header}>Sign up</h2>

          <button className={styles.oAuthBtn} onClick={handleSignUpWithGoogle}>
            <img
              className={styles.oAuthLogo}
              src={"/google-logo.png"}
              width={30}
              height={30}
            ></img>
            Sign up with Google
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
            Sign up with Facebook
          </button>

          <div className={styles.line} />
          <div className={styles.orText}>or sign up using email</div>

          <Grid
            style={{ marginTop: ".5em" }}
            container
            spacing={2}
            direction="column"
            alignItems="center"
          >
            <Grid item>
              <TextField
                id="firstName"
                label="First Name"
                variant="standard"
                style={{ marginLeft: 15, marginRight: 15 }}
                name={"firstName"}
                value={inputs.firstName}
                onChange={(e) => handleOnChange(e)}
                type="fname"
              />

              <TextField
                id="lastName"
                label="Last Name"
                variant="standard"
                style={{ marginLeft: 15, marginRight: 15 }}
                name={"lastName"}
                value={inputs.lastName}
                onChange={(e) => handleOnChange(e)}
                type="lname"
              />
            </Grid>
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
            onClick={handleSignUpWithEmail}
            className={styles.submitBtn}
          >
            Submit
          </button>
          <p className={styles.serverError}>{errors.server}</p>
        </div>
      </div>
    </Modal>
  );
}
