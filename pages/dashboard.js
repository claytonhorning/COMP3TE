import React, { useEffect, useState } from "react";
import TopNav from "../components/Nav/TopNav";
import { Box, Card } from "@mui/material";
import { Container } from "@mui/system";
import InviteFriendsCard from "../components/Cards/InviteFriends";
import { doc, onSnapshot } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const userRef = doc(database, "Users", currentUser.uid);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(userRef, (userData) => {
      console.log("Current data: ", userData.data().friends.recieved);
      setRequests(userData.data().friends.recieved);
    });

    return unsubscribe;
  }, []);

  const getUserData = async (email) => {};

  requests.map(async (request) => {
    await getUserData(request).then((res) => {
      // Render place to accept requests
    });
  });

  return (
    <>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: "2em" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>{/* <InviteFriendsCard /> */}</Box>
          <Box>
            <InviteFriendsCard />
          </Box>
        </Box>
      </Container>
    </>
  );
}
