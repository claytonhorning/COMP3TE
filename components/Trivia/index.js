import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnswerBoxes from "./AnswerBoxes";
import { Alarm, Timer } from "@mui/icons-material";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { useScoring } from "../../context/ScoreContext";
import { useAuth } from "../../context/AuthContext";

export default function Trivia({ questionIndex, playing, quizId }) {
  const [seconds, setSeconds] = useState(10);
  const [active, setActive] = useState(true);
  const [question, setQuestion] = useState("");
  const {
    choices,
    setChoices,
    handleAddScore,
    selectedAnswerId,
    setSelectedAnswerId,
    score,
    setScore,
  } = useScoring();
  const { currentUser } = useAuth();

  const getQuiz = async () => {
    const quizDocsSnapshot = await getDocs(collection(database, "Quizzes"));

    if (questionIndex) {
      quizDocsSnapshot.forEach((doc) => {
        setChoices(doc.data().questions[questionIndex].options);
        setQuestion(doc.data().questions[questionIndex].text);
      });
    }
  };

  useEffect(() => {
    getQuiz();
    setScore(0);
  }, []);

  useEffect(() => {
    if (playing === true) {
      const intervalId = setInterval(() => {
        if (seconds > 0) {
          setActive(true);
          setSeconds((prevCount) => prevCount - 1);
        } else {
          // Add score function
          handleAddScore(currentUser.uid, selectedAnswerId);
          setSelectedAnswerId();
          setActive(false);
          clearInterval(intervalId);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [seconds]);

  return (
    <>
      {playing === true ? (
        <Box sx={{ marginTop: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography color={"#878787"} variant="h5">
              Question {questionIndex + 1}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Alarm sx={{ mr: 1 }} />
              <Typography variant="h5">
                {seconds > 0 ? "Time: " + seconds + "s" : "0 s"}
              </Typography>
            </Box>
          </Box>
          <Typography marginY={1} variant="h6">
            {question}
          </Typography>
          <AnswerBoxes quizId={quizId} active={active} choices={choices} />
          {score > 0 && (
            <Typography mt={2} variant="h5" sx={{ color: "green" }}>
              +{score} points! 🥳
            </Typography>
          )}
        </Box>
      ) : (
        <Typography>Event hasn't started yet</Typography>
      )}
    </>
  );
}
