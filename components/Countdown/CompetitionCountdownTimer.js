import React, { useState } from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

export default function CompetitionCountdownTimer() {
  const countDownDate = new Date("June 3, 2022 20:00:00").getTime();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState();

  let x = setInterval(() => {
    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = countDownDate - now;
    setDistance(distance);

    // Time calculations for days, hours, minutes and seconds
    let day = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hour = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let second = Math.floor((distance % (1000 * 60)) / 1000);

    setDays(day);
    setHours(hour);
    setMinutes(minute);
    setSeconds(second);

    if (distance < 0) {
      clearInterval(x);
    }
  }, 1000);

  return (
    <>
      {distance > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 2,
          }}
        >
          <Typography textAlign={"center"} variant="h6" mb={1} color="black">
            Competition starts June 3 @ 8PM MST{" "}
          </Typography>
          <Typography textAlign={"center"} variant="h4" color="black">
            {days} days {hours} hours {minutes} minutes {seconds} seconds
          </Typography>
        </Box>
      )}
    </>
  );
}
