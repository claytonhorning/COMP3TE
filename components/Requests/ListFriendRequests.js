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

export default function ListFriendRequests() {
  const { currentUser } = useAuth();
  const userRef = doc(database, "Users", currentUser.uid);
  const [friendRequestUsers, setFriendRequestUsers] = useState([]);
  const { setAlert } = useAlert();

  useEffect(() => {
    const unsubscribe = onSnapshot(userRef, (userData) => {
      setFriendRequestUsers([]);

      userData.data().friends?.recieved?.map(async (id) => {
        const userSentRequestRef = doc(database, "Users", id);
        const docSnap = await getDoc(userSentRequestRef);

        if (docSnap.exists()) {
          let user = { ...docSnap.data(), id };
          setFriendRequestUsers((prevState) => [...prevState, user]);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    });
    return unsubscribe;
  }, []);

  const truncateString = (string, chars) => {
    if (string.length > chars) {
      return `${string.slice(0, chars)}...`;
    } else {
      return string;
    }
  };

  const handleAcceptRequest = async (userSentRequestId) => {
    // Move user sent email from recieved to accepted for current user
    const userSendingRef = doc(database, "Users", userSentRequestId);
    await updateDoc(userSendingRef, {
      "friends.accepted": arrayUnion(currentUser.uid),
      "friends.sent": arrayRemove(currentUser.uid),
    });

    // Move current users email from sent to accepted for other user
    const userRecievingRef = doc(database, "Users", currentUser.uid);
    await updateDoc(userRecievingRef, {
      "friends.accepted": arrayUnion(userSentRequestId),
      "friends.recieved": arrayRemove(userSentRequestId),
    });

    setAlert({ type: "success", message: "Friend request accepted!" });
  };

  console.log(friendRequestUsers);
  return (
    <Box sx={{ marginTop: "1em", marginBottom: "2em" }}>
      <Typography sx={{ mb: ".5em" }}>Friend requests</Typography>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#E5ECF5",
        }}
        aria-label="user invite"
      >
        {friendRequestUsers.length !== 0 &&
          friendRequestUsers.map((user, index) => {
            return (
              <div key={user.email}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={truncateString(user.email, 18)}
                  />
                  <Button onClick={() => handleAcceptRequest(user.id)}>
                    <CheckCircleIcon color="success" fontSize={"medium"} />
                  </Button>

                  {friendRequestUsers.length - 1 !== index && <Divider />}
                </ListItem>
              </div>
            );
          })}
        {friendRequestUsers.length === 0 && (
          <Typography sx={{ textAlign: "center", color: "#ccc" }}>
            No requests
          </Typography>
        )}
      </List>
    </Box>
  );
}
