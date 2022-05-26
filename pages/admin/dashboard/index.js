import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import TopNav from "../../../components/Nav/TopNav";
import CheckIcon from "@mui/icons-material/Check";
import { database } from "../../../firebaseConfig";
import { addDoc, collection, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [quizName, setQuizName] = useState("");

  // Create quiz and send quiz id to question
  const quizzesRef = collection(database, "Quizzes");
  const router = useRouter();
  const [error, setError] = useState("");

  const createNewQuiz = async () => {
    if (quizName.length >= 5) {
      await addDoc(quizzesRef, {
        name: quizName,
        questions: [],
      }).then((doc) => {
        router.push(`dashboard/quizzes/${doc.id}`);
      });
    } else {
      setError("Quiz name must be at least 5 characters");
    }
  };

  useEffect(() => {
    setError("");
  }, [quizName]);

  return (
    <React.Fragment>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: "2em" }}>
        <Typography mb={1} variant="h6"></Typography>
        <Stack spacing={2} width={"50%"}>
          <TextField
            id="quizName"
            label="Quiz name"
            variant="outlined"
            onChange={(e) => setQuizName(e.target.value)}
          />
          <Button onClick={createNewQuiz} variant={"contained"}>
            Create a new quiz
          </Button>
          {error !== "" && (
            <Typography mt={1} color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </Container>
    </React.Fragment>
  );
}
