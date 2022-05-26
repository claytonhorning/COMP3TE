import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnswerBoxes from "./AnswerBoxes";
import { Alarm, Timer } from "@mui/icons-material";

export default function Trivia() {
  const choices = [
    { id: 1, text: "Tunisia", answer: false },
    { id: 2, text: "Algeria", answer: false },
    { id: 3, text: "Nigeria", answer: true },
    { id: 4, text: "Spain", answer: false },
  ];

  const [seconds, setSeconds] = useState(10);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevCount) => prevCount - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

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
          Question #1
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Alarm sx={{ mr: 1 }} />
          <Typography variant="h5">
            {seconds > 0 ? "Time: " + seconds + "s" : "0 s"}
          </Typography>
        </Box>
      </Box>
      <Typography marginY={1} variant="h6">
        The ancient Phoenician city of Constantine is located in what modern-day
        Arab country?
      </Typography>
      <AnswerBoxes active={active} choices={choices} />
    </Box>
  );
}
