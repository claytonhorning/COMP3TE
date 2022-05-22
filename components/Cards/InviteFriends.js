import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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

  const checkIfAlreadyRequest = async (email) => {
    const userQuery = query(databaseRef, where("email", "==", email));
    const userQuerySnapshot = await getDocs(userQuery);

    userQuerySnapshot.forEach((doc) => {
      recievingUser = doc.id;
    });

    const userSendingRef = doc(database, "Users", currentUser.uid);

    const docSnap = await getDoc(userSendingRef);

    if (docSnap.exists()) {
      let user = docSnap.data();
      console.log(user.friends.sent);

      if (user.friends.sent.includes(recievingUser)) {
        return true;
      } else {
        return false;
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    return false;
  };

  useEffect(() => {
    setError("");
  }, [friend]);

  const handleSendFriendRequest = async () => {
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
      return;
    } else if (await checkIfAlreadyRequest(friend)) {
      setError("Request already sent.");
      return;
    } else if (await checkUserExists(friend)) {
      await handleSendFriendRequest();
      setFriend("");
      // Send alert that request was sent
      setAlert({ type: "success", message: "Friend request sent!" });
      return;
    } else {
      setError("User does not exist.");

      return;
    }
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  return (
    <Card sx={{ width: 300 }}>
      <CardHeader title={"Invite your friends"}></CardHeader>
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
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          onClick={handleInviteFriend}
          startIcon={<AddCircle />}
          size="medium"
        >
          Add friend
        </Button>

        {/* <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
      </CardActions>
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Sent:</Typography>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "#E5ECF5",
            }}
            aria-label="user invite"
          >
            <ListItem button>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={"hello"} secondary={"hello"} />
              <Button onClick={() => handleAcceptRequest(user.id)}>
                <CheckCircleIcon color="success" fontSize={"medium"} />
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Collapse> */}
    </Card>
  );
}
