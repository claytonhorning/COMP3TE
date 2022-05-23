import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/system";
import { Typography } from "@mui/material";
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
      const teamDocRef = doc(database, "Teams", teamId);
      const teamDoc = await getDoc(teamDocRef);

      if (teamDoc.exists()) {
        setTeam({ ...teamDoc.data() });
      } else {
        console.log("Could not get team data");
      }
    });

    return unsubscribe;
  }, []);

  console.log(team);

  return (
    <Box
      sx={{
        backgroundColor: "#F6F6F6",
        height: 40,
        display: "flex",
        alignItems: "center",
        paddingX: 2,
        paddingY: 3,
      }}
    >
      <Box>
        {team.name !== ("" || undefined) ? (
          <Typography variant="h6">
            <span style={{ fontWeight: 600 }}>Team:</span>{" "}
            {team.name !== ("" || undefined) ? team.name : "No team"}
          </Typography>
        ) : (
          <Typography color={"#ccc"} variant="h6">
            No team
          </Typography>
        )}
      </Box>
    </Box>
  );
}
