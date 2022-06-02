import React, { createContext, useState, useContext } from "react";
import { database } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const ScoreContext = createContext();

export function useScoring() {
  return useContext(ScoreContext);
}

export function ScoreProvider({ children, currentUser, quizId }) {
  const [selectedAnswerId, setSelectedAnswerId] = useState();
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(10);

  const checkCorrect = () => {
    const correctAnswer = choices.findIndex((choice) => choice.answer === true);

    if (selectedAnswerId - 1 === correctAnswer) {
      return true;
    } else {
      return false;
    }
  };

  const handleAddScore = (selectedId) => {
    setSelectedAnswerId(selectedId);

    if (checkCorrect(selectedId)) {
      addScores(10);
      // Display ui for added points
      setScore(10);
    } else {
      // Display ui for incorrect answer no points
      setScore(0);
    }
  };

  const addScores = async (value) => {
    const userRef = doc(database, "Users", currentUser.uid);
    const userDoc = await getDoc(userRef);
    let prevScore = 0;

    if (userDoc.data().quizScores) {
      const currentQuizScores = userDoc.data().quizScores;

      prevScore = currentQuizScores[quizId];
    }

    await setDoc(
      userRef,
      {
        quizScores: {
          [quizId]: value + prevScore,
        },
      },
      { merge: true }
    );

    const teamRef = doc(database, "Teams", userDoc.data().team);
    const teamDoc = await getDoc(teamRef);
    let prevTeamScore = 0;

    if (teamDoc.data().quizScores) {
      const currentQuizScores = teamDoc.data().quizScores;

      prevTeamScore = currentQuizScores[quizId];
    }

    await setDoc(
      teamRef,
      {
        quizScores: {
          [quizId]: prevTeamScore + value,
        },
      },
      { merge: true }
    );
  };

  const value = {
    selectedAnswerId,
    setSelectedAnswerId,
    choices,
    setChoices,
    handleAddScore,
    score,
    setScore,
  };

  return (
    <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
  );
}

// Somewhere to keep track of whether the answer is right

// Function to add the score if the answer is correct
