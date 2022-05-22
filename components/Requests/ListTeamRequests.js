import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  ListItemAvatar,
  Button,
  Typography,
} from "@mui/material";
import {
  doc,
  onSnapshot,
  collection,
  query,
  getDocs,
  where,
  getDoc,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAlert } from "../../context/AlertContext";

export default function ListTeamRequests() {
  const { currentUser } = useAuth();
  const currentUserRef = doc(database, "Users", currentUser.uid);
  const [teamRequests, setTeamRequests] = useState([]);
  const { setAlert } = useAlert();

  useEffect(() => {
    // Look in users teams.recieved and then get the data for that team

    const unsubscribe = onSnapshot(currentUserRef, (userData) => {
      setTeamRequests([]);

      userData.data().teams?.recieved?.map(async (teamId) => {
        const teamRef = doc(database, "Teams", teamId);
        const teamDoc = await getDoc(teamRef);

        if (teamDoc.exists()) {
          let teamRequest = { ...teamDoc.data(), teamId };

          let creatorRef = doc(database, "Users", teamDoc.data().creator);
          let creator = await getDoc(creatorRef);

          setTeamRequests((prevState) => [
            ...prevState,
            { ...teamRequest, creatorName: creator.data().name },
          ]);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    });

    return unsubscribe;
  }, []);

  console.log(teamRequests);

  const truncateString = (string, chars) => {
    if (string.length > chars) {
      return `${string.slice(0, chars)}...`;
    } else {
      return string;
    }
  };

  const handleAcceptRequest = async (teamId, userSentRequestId) => {
    // Move user sent email from recieved to accepted for current user
    const userSendingRef = doc(database, "Users", userSentRequestId);
    await updateDoc(userSendingRef, {
      "teams.accepted": teamId,
      "teams.sent": arrayRemove(teamId),
    });

    // Move current users email from sent to accepted for other user
    const userRecievingRef = doc(database, "Users", currentUser.uid);
    await updateDoc(userRecievingRef, {
      "teams.accepted": teamId,
      "teams.recieved": arrayRemove(teamId),
    });

    setAlert({ type: "success", message: "Friend request accepted!" });
  };

  return (
    <Box sx={{ marginTop: "1em", marginBottom: "2em" }}>
      <Typography sx={{ mb: ".5em" }}>Team requests</Typography>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#E5ECF5",
        }}
        aria-label="user invite"
      >
        {teamRequests.length !== 0 &&
          teamRequests.map((team, index) => {
            return (
              <div key={team.id}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={team.name}
                    secondary={truncateString(team.creatorName, 18)}
                  />
                  <Button
                    onClick={() =>
                      handleAcceptRequest(team.teamId, team.creator)
                    }
                  >
                    <CheckCircleIcon color="success" fontSize={"medium"} />
                  </Button>

                  {teamRequests.length - 1 !== index && <Divider />}
                </ListItem>
              </div>
            );
          })}
        {teamRequests.length === 0 && (
          <Typography sx={{ textAlign: "center", color: "#ccc" }}>
            No requests
          </Typography>
        )}
      </List>
    </Box>
  );
}
