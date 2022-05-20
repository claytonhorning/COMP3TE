import React from "react";
import { Container, Box, Typography } from "@mui/material";
import styles from "../../styles/LandingPage/Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroHeader}>
          You +2 friends, 3 mini games, $100 reward
        </h1>
        <p className={styles.heroSubheader}>
          Live gameshow where teams battle it out for the prize. 1 game of
          strategy, 1 game of dexterity, and 1 game of knowledge.
        </p>
      </div>
    </div>
  );
}
