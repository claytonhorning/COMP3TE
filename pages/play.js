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

export default function Dashboard() {
  const [player, setPlayer] = useState();

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

            <Trivia />
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
