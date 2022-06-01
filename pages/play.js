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
import {
  onSnapshot,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import { ScoreProvider, useScoring } from "../context/ScoreContext";
import { useAuth } from "../context/AuthContext";
import LeaderboardCard from "../components/Cards/Leaderboard";
import withAuth from "../components/PrivateRoute";
import { useRouter } from "next/router";

const Play = () => {
  const [player, setPlayer] = useState();
  const [questionIndex, setQuestionIndex] = useState();
  const [currentQuiz, setCurrentQuiz] = useState({});
  const [quizId, setQuizId] = useState("");
  const { currentUser } = useAuth();
  const router = useRouter();

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
    height: 267,
    width: 475,
    channel: "comp3teofficial",
    parent: "localhost",
    allowFullscreen: true,
    layout: "video",
  };

  const getCurrentQuiz = async () => {
    let quizId = "";
    const q = query(
      collection(database, "Quizzes"),
      where("current", "==", true)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCurrentQuiz({ ...doc.data(), id: doc.id });
      setQuizId(doc.id);
      quizId = doc.id;
    });

    const currentQuizRef = doc(database, "Quizzes", quizId);

    const unsubscribe = onSnapshot(currentQuizRef, async (quizData) => {
      setCurrentQuiz(quizData.data());
      setQuestionIndex(quizData.data().currentQuestion);
    });

    return unsubscribe;
  };

  useEffect(() => {
    getCurrentQuiz();

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

  const handleRedirect = () => {
    router.push("/signup");
  };

  return (
    <>
      {currentUser === null ? (
        handleRedirect()
      ) : (
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
                <CompetitionCountdownTimer />

                <ScoreProvider quizId={quizId} currentUser={currentUser}>
                  <Trivia
                    playing={currentQuiz.active}
                    key={questionIndex}
                    questionIndex={questionIndex}
                    quizId={quizId}
                  />
                </ScoreProvider>
                <Box
                  id="video"
                  sx={{
                    display: "flex",

                    marginTop: 2,
                  }}
                ></Box>
              </Box>

              <Box sx={styles.sidebar}>
                {currentQuiz.active !== true ? (
                  <Box>
                    <InviteFriendsCard />
                    <ListFriendRequests />
                    <InviteTeamCard />
                    <ListTeamRequests />
                  </Box>
                ) : (
                  <Box>
                    <LeaderboardCard
                      quizId={quizId}
                      currentUser={currentUser}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </>

    // )}
  );
};

export default withAuth(Play);
