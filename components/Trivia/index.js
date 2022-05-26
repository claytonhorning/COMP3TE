import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnswerBoxes from "./AnswerBoxes";
import { Alarm, Timer } from "@mui/icons-material";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../../firebaseConfig";

export default function Trivia({ questionIndex }) {
  const [seconds, setSeconds] = useState(10);
  const [active, setActive] = useState(false);
  const [choices, setChoices] = useState([]);
  const [question, setQuestion] = useState("");

  const getQuiz = async () => {
    const quizDocsSnapshot = await getDocs(collection(database, "Quizzes"));

    quizDocsSnapshot.forEach((doc) => {
      setChoices(doc.data().questions[questionIndex].options);
      setQuestion(doc.data().questions[questionIndex].text);
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevCount) => prevCount - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    getQuiz();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [seconds]);

  return (
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
      <AnswerBoxes active={active} choices={choices} />
    </Box>
  );
}
