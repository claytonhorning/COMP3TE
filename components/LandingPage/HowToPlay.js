import React, { useState } from "react";
import styles from "../../styles/LandingPage/HowToPlay.module.css";
import SignUp from "../Auth/SignUp";
import Link from "next/link";
import { SignUpModalContext } from "../../context/SignUpModalContext";
import { useAuth } from "../../context/AuthContext";

export default function HowToPlay() {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <div className={styles.howToPlaySection}>
      <div className={styles.numbers}>
        <div className={styles.numberCircle}>
          <p>1.</p>
        </div>
        <div className={styles.dashedLine} />
        <div className={styles.numberCircle}>
          <p>2.</p>
        </div>
        <div className={styles.dashedLine} />
        <div className={styles.numberCircle}>
          <p>3.</p>
        </div>
      </div>
      <div className={styles.content}>
        <DetailRow
          title={currentUser ? "Sign up ✅" : "Sign up"}
          description={
            "Sign up for an account - all we require is your name and email."
          }
          btnTitle={"Sign up"}
          onClick={() => {
            setSignUpOpen(true);
          }}
        />
        <DetailRow
          title={"Assemble your team"}
          description={
            "Invite your friends or family to join you in winning some serious cash money."
          }
          btnTitle={"Invite friends"}
        />
        <DetailRow
          title={"May 27th @ 6pm MST"}
          description={
            "Invite your friends or family to join you in winning some serious cash money."
          }
          btnTitle={"Set reminder"}
        />
      </div>
      <SignUpModalContext.Provider value={{ signUpOpen, setSignUpOpen }}>
        <SignUp open={signUpOpen} />
      </SignUpModalContext.Provider>
    </div>
  );
}

function DetailRow({ title, description, btnTitle, onClick }) {
  return (
    <div className={styles.row}>
      <div className={styles.col}>
        <h2 className={styles.header}>{title}</h2>
        <p className={styles.paragraph}>{description}</p>
      </div>
      <div className={styles.col}>
        <button onClick={onClick} className={styles.btn}>
          {btnTitle}
        </button>
      </div>
    </div>
  );
}
