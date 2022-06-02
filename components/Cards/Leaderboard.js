import React, { useEffect, useState } from "react";
import {
  Button,
  CardContent,
  CardHeader,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { truncateString } from "../../utils";

export default function LeaderboardCard({ quizId }) {
  const teamsCollection = collection(database, "Teams");
  const [leaderboardTeams, setLeaderboardTeams] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(teamsCollection, (teamsData) => {
      let leaderboard = [];

      teamsData.forEach((doc) => {
        if (doc.data().quizScores?.[quizId] !== undefined) {
          leaderboard.push(doc.data());
          leaderboard.sort(
            (a, b) => b.quizScores[quizId] - a.quizScores[quizId]
          );
        }
      });

      setLeaderboardTeams(leaderboard);
    });

    return unsubscribe;
  }, []);

  return (
    <Card sx={{ width: 300 }}>
      <CardHeader title={"Leaderboard"}></CardHeader>
      <CardContent>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "#EEEEEE",
          }}
          aria-label="user invite"
        >
          {leaderboardTeams !== [] ? (
            leaderboardTeams.map((team, index) => {
              return (
                <>
                  <ListItem
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>
                      <span style={{ color: "#3874CC" }}>{index + 1}.</span>{" "}
                      {truncateString(team.name, 15)}
                    </Typography>
                    <Typography color={green[500]}>
                      {team.quizScores[quizId]} pts.
                    </Typography>
                  </ListItem>
                  {index + 1 !== leaderboardTeams.length && <Divider />}
                </>
              );
            })
          ) : (
            <Typography>No leaderboard yet</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
