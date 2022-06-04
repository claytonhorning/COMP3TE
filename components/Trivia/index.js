import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnswerBoxes from "./AnswerBoxes";
import { Alarm, Timer } from "@mui/icons-material";
import { getDoc, doc } from "firebase/firestore";
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
    const quizDoc = await getDoc(
      doc(database, "Quizzes", "ZrAuiqFyqJ8XHjkXg08Z")
    );

    if (questionIndex) {
      setChoices(quizDoc.data().questions[questionIndex].options);
      setQuestion(quizDoc.data().questions[questionIndex].text);
    } else {
      setChoices(quizDoc.data().questions[0].options);
      setQuestion(quizDoc.data().questions[0].text);
    }
  };

  useEffect(() => {
    getQuiz();
    setScore(0);
  }, []);

  useEffect(() => {
    // if (playing === true) {
    //   const intervalId = setInterval(() => {
    //     if (seconds > 0) {
    //       setActive(true);
    //       setSeconds((prevCount) => prevCount - 1);
    //     } else {
    //       // Add score function
    //       handleAddScore(currentUser.uid, selectedAnswerId);
    //       setSelectedAnswerId();
    //       setActive(false);
    //       clearInterval(intervalId);
    //     }
    //   }, 1000);
    // }
    // return () => clearInterval(intervalId);
    // if (playing === true) {
    //   var start = Date.now();
    //   const intervalId = setInterval(function () {
    //     if (seconds > 0) {
    //       var delta = Date.now() - start;
    //       let secondsPassed = Math.floor(delta / 1000);
    //       setActive(true);
    //       setSeconds(prevCount);
    //       // in seconds
    //       // alternatively just show wall clock time:
    //     } else {
    //       handleAddScore(currentUser.uid, selectedAnswerId);
    //       setSelectedAnswerId();
    //       setActive(false);
    //       clearInterval(intervalId);
    //     }
    //   }, 1000); // update about every second
    // }
    // return () => clearInterval(intervalId);
  }, [seconds]);

  const [basis, setBasis] = useState();
  const [timer, setTimer] = useState();
  const [timerDisp, setTimerDisp] = useState();
  const [intervalId, setIntervalId] = useState();

  useEffect(() => {
    let _intervalId;
    if (basis)
      _intervalId = setInterval(() => {
        setTimer(new Date().valueOf());
      }, 100);
    setIntervalId(_intervalId);
    return () => {
      clearInterval(_intervalId);
    };
  }, [basis]);

  useEffect(() => {
    if (basis && timer) {
      const toDisp = Math.floor((basis - timer) / 1000);
      if (timerDisp !== toDisp) {
        setTimerDisp(toDisp);
      }
    }
  }, [timer]);

  useEffect(() => {
    if (timerDisp <= 0) {
      handleAddScore(currentUser.uid, selectedAnswerId);
      setSelectedAnswerId();
      setActive(false);
      clearInterval(intervalId);
    } else {
      setActive(true);
    }
  }, [timerDisp]);

  useEffect(() => {
    if (playing === true) {
      let futureDate = new Date();
      futureDate.setSeconds(futureDate.getSeconds() + 15);
      setBasis(futureDate.valueOf());
    }
  }, []);

  return (
    <>
      {playing === true && (
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
                {timerDisp > 0 ? "Time: " + timerDisp + "s" : "0 s"}
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
      )}
    </>
  );
}
