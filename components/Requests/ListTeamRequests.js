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
        {/* {friendRequestUsers.length !== 0 &&
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
        )} */}
      </List>
    </Box>
  );
}
