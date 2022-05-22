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
  Autocomplete,
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

export default function InviteTeamCard() {
  const [team, setTeam] = useState("");
  const [invite1, setInvite1] = useState("");
  const [invite2, setInvite2] = useState("");
  const [errors, setErrors] = useState({});

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const { currentUser } = useAuth();

  const friendOptions = [];
  const currentUserRef = doc(database, "Users", currentUser.uid);

  const getFriends = async () => {
    const userDoc = await getDoc(currentUserRef);
    if (userDoc.exists()) {
      userDoc.data().friends.accepted.map(async (friendId) => {
        const friendDoc = await getDoc(doc(database, "Users", friendId));
        if (friendDoc.exists()) {
          friendOptions.push({ ...friendDoc.data(), id: friendId });
        } else {
          console.log("User does not exist");
        }
      });
    }
  };

  const teamDatabaseRef = collection(database, "Teams");

  // const invite1User = friendOptions.filter((friend) => {
  //   return friend.email === invite1.email;
  // });

  // const invite2User = friendOptions.filter((friend) => {
  //   return friend.email === invite2.email;
  // });

  // const teamData = {
  //   name: team,
  //   members: [invite1User[0].id, invite2User[0].id],
  // };

  const sendTeamRequest = async () => {
    // Create the team in the database
    const teamDoc = await addDoc(teamDatabaseRef, {
      name: team,
    });

    await updateDoc(currentUserRef, {
      "teams.sent": arrayUnion(teamDoc.id),
    });

    if (invite1.id !== undefined) {
      await updateDoc(doc(database, "Users", invite1.id), {
        "teams.recieved": arrayUnion(teamDoc.id),
      });
    }

    if (invite2.id !== undefined) {
      await updateDoc(doc(database, "Users", invite1.id), {
        "teams.recieved": arrayUnion(teamDoc.id),
      });
    }
  };

  const handleCreateTeam = async () => {
    if (team === "") {
      handleError("Enter a team name", "team");
      return;
    } else if (team.length < 5) {
      handleError("Team name must be 5 characters", "team");
      return;
    }

    await sendTeamRequest();
  };

  useEffect(() => {
    setErrors({});
  }, [team, invite1, invite2]);

  console.log(errors);

  getFriends();

  return (
    <Card sx={{ width: 300 }}>
      <CardHeader title={"Assemble your team"}></CardHeader>
      <CardContent>
        <Typography paragraph>
          Create a team name and invite up to two friends.
        </Typography>
        <TextField
          id="outlined-basic"
          label="Team name"
          variant="standard"
          fullWidth
          name="team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          error={errors.team !== undefined && true}
          helperText={errors.team}
        />
        <Autocomplete
          value={invite1}
          onChange={(event, text) => {
            setInvite1(text);
          }}
          id="invite1"
          options={friendOptions}
          getOptionLabel={(option) => option.email || ""}
          sx={{ mt: 2 }}
          renderInput={(params) => (
            <TextField {...params} label="Friend #1 email" variant="standard" />
          )}
        />
        <Autocomplete
          value={invite2}
          onChange={(event, text) => {
            setInvite2(text);
          }}
          id="invite2"
          options={friendOptions}
          getOptionLabel={(option) => option.email || ""}
          sx={{ mt: 2 }}
          renderInput={(params) => (
            <TextField {...params} label="Friend #2 email" variant="standard" />
          )}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          onClick={handleCreateTeam}
          startIcon={<AddCircle />}
          size="medium"
        >
          Create team
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
