import React, { useEffect, useState } from "react";
import TopNav from "../components/Nav/TopNav";
import { Box, Card, Typography } from "@mui/material";
import { Container } from "@mui/system";
import InviteFriendsCard from "../components/Cards/InviteFriends";
import ListFriendRequests from "../components/Requests/ListFriendRequests";
import ListTeamRequests from "../components/Requests/ListTeamRequests";
import InviteTeamCard from "../components/Cards/InviteTeam";
import TopBarInfo from "../components/TopBar/TopBarInfo";
import CompetitionCountdownTimer from "../components/Countdown/CompetitionCountdownTimer";
import Trivia from "../components/Trivia";
import { onSnapshot, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

export default function Dashboard() {
  const [player, setPlayer] = useState();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeInterval, setTimeInterval] = useState(20);

  const styles = {
    sidebar: {
      height: "90vh",
      width: "300",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      overflowY: "scroll",
      padding: "10px",
    },
  };

  const options = {
    width: "100%",
    height: 650,
    channel: "comp3teofficial",
    parent: "localhost",
    allowFullscreen: true,
    layout: "video",
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.twitch.tv/js/embed/v1.js";
    script.async = true;
    document.body.appendChild(script);

    const loadPlayer = async () => {
      let embed = await new Twitch.Embed("video", options);
      setPlayer(embed);
    };

    script.onload = async () => {
      await loadPlayer();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timeInterval > 0) {
        setTimeInterval((prevCount) => prevCount - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const numOfQuestions = 2;

  useEffect(() => {
    if (questionIndex < numOfQuestions - 1) {
      if (timeInterval === 0) {
        setQuestionIndex((prevCount) => prevCount + 1);
        setTimeInterval(20);
      }
    }
  }, [timeInterval]);

  useEffect(() => {
    const quizzesRef = collection(database, "Quizzes");
    const unsubscribe = onSnapshot(quizzesRef, async (quizData) => {
      const quizzes = await quizData.data();
      console.log(quizzes);
    });

    return unsubscribe;
  }, []);

  return (
    <Box>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: "2em" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              marginRight: 2,
              marginTop: 1.2,
            }}
          >
            <TopBarInfo />
            {/* <CompetitionCountdownTimer /> */}
            {/* <Box
              sx={{
                display: "flex",
                height: "88%",
                // backgroundColor: "black",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <div style={{ flexGrow: 1 }} id="video"></div>
            </Box> */}

            <Trivia key={questionIndex} questionIndex={questionIndex} />
          </Box>

          <Box sx={styles.sidebar}>
            <InviteFriendsCard />
            <ListFriendRequests />
            <InviteTeamCard />
            <ListTeamRequests />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
