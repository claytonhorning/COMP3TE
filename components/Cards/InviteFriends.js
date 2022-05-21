import React, { useEffect, useState } from "react";
import {
  CardHeader,
  TextField,
  Typography,
  Button,
  CardContent,
  CardActions,
  Card,
  Alert,
  Snackbar,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { app, database } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

export default function InviteFriendsCard() {
  const [friend, setFriend] = useState("");
  const databaseRef = collection(database, "Users");
  const { currentUser } = useAuth();
  const { setAlert } = useAlert();
  const [error, setError] = useState("");

  let recievingUser = null;

  const checkUserExists = async (email) => {
    const userQuery = query(databaseRef, where("email", "==", email));
    const userQuerySnapshot = await getDocs(userQuery);

    userQuerySnapshot.forEach((doc) => {
      recievingUser = doc.id;
    });

    return !userQuerySnapshot.empty;
  };

  useEffect(() => {
    setError("");
  }, [friend]);

  const handleFriendRequestSent = async () => {
    const userSendingRef = doc(database, "Users", currentUser.uid);
    // Add friend to sent array of current user
    await updateDoc(userSendingRef, {
      "friends.sent": arrayUnion(recievingUser),
    });
    // Add current user to recpient recieved
    // 1. get uid of entered email
    const userRecievingRef = doc(database, "Users", recievingUser);
    await updateDoc(userRecievingRef, {
      "friends.recieved": arrayUnion(currentUser.uid),
    });
  };

  const handleInviteFriend = async () => {
    if (friend === currentUser.email) {
      setError("Cannot add yourself as a friend.");
    } else if (await checkUserExists(friend)) {
      await handleFriendRequestSent();

      setFriend("");
      // Send alert that request was sent
      setAlert({ type: "success", message: "Friend request sent!" });
    } else {
      setError("User does not exist.");
    }
  };

  return (
    <Card sx={{ width: 300 }}>
      <CardHeader title={"Assemble your team"}>
        <Typography sx={{ fontSize: 14 }}>Assemble your team</Typography>
      </CardHeader>
      <CardContent>
        <Typography paragraph>
          Invite as many friends as you'd like. You can compete with 3 on a
          team.
        </Typography>
        <TextField
          id="outlined-basic"
          label="Email address"
          variant="standard"
          fullWidth
          name="friend"
          value={friend}
          onChange={(e) => setFriend(e.target.value)}
          error={error !== "" && true}
          helperText={error}
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={handleInviteFriend}
          startIcon={<AddCircle />}
          size="medium"
        >
          Add friend
        </Button>
      </CardActions>
    </Card>
  );
}
