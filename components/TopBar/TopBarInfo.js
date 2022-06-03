import React, { useEffect, useState } from "react";
import { Typography, Container, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { database } from "../../firebaseConfig";

export default function TopBarInfo() {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState({});
  const currentUserRef = doc(database, "Users", currentUser.uid);

  useEffect(() => {
    const unsubscribe = onSnapshot(currentUserRef, async (userData) => {
      const teamId = userData.data().team;

      if (teamId) {
        const teamDocRef = doc(database, "Teams", teamId);
        const teamDoc = await getDoc(teamDocRef);

        if (teamDoc.exists()) {
          setTeam({ ...teamDoc.data() });
        } else {
          console.log("Could not get team data");
        }
      } else {
        ("No team");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#9921e8",
        backgroundImage: "linear-gradient(315deg, #7f53ac 0%, #647dee 74%)",
        height: 40,
        display: "flex",
        alignItems: "center",
        paddingX: 2,
        paddingY: 3,
        color: "white",
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Typography mr={2} variant="h6">
          {" "}
          <span style={{ fontWeight: 600 }}>Prize:</span> $50
        </Typography>
        {team.name !== ("" || undefined) ? (
          <Typography mr={2} variant="h6">
            <span style={{ fontWeight: 600 }}>Team:</span>{" "}
            {team.name !== ("" || undefined) ? team.name : "No team"}
          </Typography>
        ) : (
          <Typography mr={2} color={"#ccc"} variant="h6">
            No team
          </Typography>
        )}
        {/* <Typography mr={2} variant="h6">
          {" "}
          <span style={{ fontWeight: 600 }}>Trivia:</span> Question #1
        </Typography> */}
      </Box>
    </Box>
  );
}
