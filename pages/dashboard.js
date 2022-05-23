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

export default function Dashboard() {
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
  return (
    <>
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
            <Box
              sx={{
                display: "flex",
                height: "88%",
                backgroundColor: "black",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <CompetitionCountdownTimer />
            </Box>
          </Box>

          <Box sx={styles.sidebar}>
            <InviteFriendsCard />
            <ListFriendRequests />
            <InviteTeamCard />
            <ListTeamRequests />
          </Box>
        </Box>
      </Container>
    </>
  );
}
