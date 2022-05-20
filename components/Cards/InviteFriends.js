import React, { useState } from "react";
import {
  CardHeader,
  TextField,
  Typography,
  Button,
  CardContent,
  CardActions,
  Card,
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
} from "firebase/firestore";

export default function InviteFriendsCard() {
  const [friend, setFriend] = useState("");
  const databaseRef = collection(database, "Users");

  const checkUserExists = async (email) => {
    let user = null;
    const userQuery = query(databaseRef, where("email", "==", email));

    const userQuerySnapshot = await getDocs(userQuery);

    if (userQuerySnapshot.empty) {
      console.log("empty");
    } else {
      console.log("not empty");
    }

    userQuerySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      user = doc.data();
    });
  };

  const handleInviteFriend = () => {
    if (checkUserExists(friend)) {
      // Add to the friends list
      console.log("user exists");
    } else {
      // Set error to user does not exist
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
          onChange={(e) => setFriend(e.target.value)}
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
