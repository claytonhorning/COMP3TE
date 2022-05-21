import React, { useEffect, useState } from "react";
import TopNav from "../components/Nav/TopNav";
import { Box, Card } from "@mui/material";
import { Container } from "@mui/system";
import InviteFriendsCard from "../components/Cards/InviteFriends";
import ListRequests from "../components/FriendRequests/ListRequests";

export default function Dashboard() {
  return (
    <>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: "2em" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>{/* <InviteFriendsCard /> */}</Box>
          <Box>
            <InviteFriendsCard />
            <ListRequests />
          </Box>
        </Box>
      </Container>
    </>
  );
}
