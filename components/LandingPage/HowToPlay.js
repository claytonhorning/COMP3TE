import React from "react";
import styles from "../../styles/LandingPage/HowToPlay.module.css";

export default function HowToPlay() {
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
          title={"Sign up"}
          description={
            "Sign up for an account - all we require is your name and email."
          }
          btnTitle={"Sign up"}
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
    </div>
  );
}

function DetailRow({ title, description, btnTitle }) {
  return (
    <div className={styles.row}>
      <div className={styles.col}>
        <h2 className={styles.header}>{title}</h2>
        <p className={styles.paragraph}>{description}</p>
      </div>
      <div className={styles.col}>
        <button className={styles.btn}>{btnTitle}</button>
      </div>
    </div>
  );
}
