import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Typography,
  CardActions,
  CardContent,
  CardHeader,
  Card,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { database } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

export default function InviteTeamCard() {
  const [team, setTeam] = useState("");
  const [invite1, setInvite1] = useState("");
  const [invite2, setInvite2] = useState("");
  const [errors, setErrors] = useState({});
  const { setAlert } = useAlert();
  const { currentUser } = useAuth();
  const [friendOptions, setFriendOptions] = useState([]);
  const currentUserRef = doc(database, "Users", currentUser.uid);
  const teamDatabaseRef = collection(database, "Teams");

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(currentUserRef, async (userData) => {
      setFriendOptions([]);

      userData.data().friends?.accepted?.map(async (friendId) => {
        const friendDoc = await getDoc(doc(database, "Users", friendId));
        if (friendDoc.exists()) {
          setFriendOptions((prevState) => [
            ...prevState,
            { ...friendDoc.data(), id: friendId },
          ]);
          //  friendOptions.push({ ...friendDoc.data(), id: friendId });
        } else {
          console.log("User does not exist");
        }
      });
    });
    return unsubscribe;
  }, []);

  const sendTeamRequest = async () => {
    const currentUserDoc = await getDoc(currentUserRef);
    // Create the team in the database
    const teamDoc = await addDoc(teamDatabaseRef, {
      name: team,
      creator: {
        id: currentUser.uid,
        avatar:
          currentUserDoc.data().avatar !== undefined
            ? currentUserDoc.data().avatar
            : "",
        email: currentUserDoc.data().email,
        name: currentUserDoc.data().name,
      },
      members: [currentUser.uid],
    });

    await updateDoc(currentUserRef, {
      "teams.sent": arrayUnion(teamDoc.id),
      team: teamDoc.id,
      "teams.accepted": teamDoc.id,
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
    setTeam("");
    setInvite1("");
    setInvite2("");

    setAlert({ type: "success", message: "Team invite sent" });
  };

  useEffect(() => {
    setErrors({});
  }, [team, invite1, invite2]);

  return (
    <Card sx={{ width: 300 }}>
      <CardHeader title={"Assemble your team"}></CardHeader>
      <CardContent>
        <Typography paragraph>
          Create a team name and invite up to two friends. You can only be on
          one team at a time.
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
            <TextField {...params} label="Friend 1 email" variant="standard" />
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
            <TextField {...params} label="Friend 2 email" variant="standard" />
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
