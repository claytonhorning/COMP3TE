import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import TopNav from "../../../components/Nav/TopNav";
import { database } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useAlert } from "../../../context/AlertContext";

export default function Dashboard() {
  const [quizName, setQuizName] = useState("");

  // Create quiz and send quiz id to question
  const quizzesRef = collection(database, "Quizzes");
  const router = useRouter();
  const [error, setError] = useState("");
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectLiveQuiz, setSelectLiveQuiz] = useState("");
  const [selectCurrentQuiz, setSelectCurrentQuiz] = useState("");
  const { setAlert } = useAlert();

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

  useEffect(() => {
    const getAllQuizzes = async () => {
      const quizzes = await getDocs(quizzesRef);
      setAllQuizzes([]);

      quizzes.forEach((quiz) => {
        const quizId = quiz.id;

        setAllQuizzes((prevState) => [
          ...prevState,
          { ...quiz.data(), id: quizId },
        ]);
      });
    };
    getAllQuizzes();
  }, []);

  const handleSetQuizActive = async () => {
    const quizRef = doc(database, "Quizzes", selectLiveQuiz);
    await updateDoc(quizRef, { active: true });

    setAlert({ type: "success", message: "Live event started!" });
    setSelectLiveQuiz("");
  };

  const handleSetCurrentQuiz = async () => {
    const quizRef = doc(database, "Quizzes", selectCurrentQuiz);
    await updateDoc(quizRef, { current: true });

    setAlert({ type: "success", message: "Saved as current quiz!" });
    setSelectCurrentQuiz("");
  };

  return (
    <React.Fragment>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: "2em" }}>
        <Typography mb={1} variant="h6"></Typography>
        <Box sx={{ display: "flex" }}>
          <Stack spacing={2} width={"50%"} mr={1}>
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

            <FormControl fullWidth>
              <InputLabel id="quiz">Quiz</InputLabel>
              <Select
                id="quiz"
                label="quiz"
                value={selectCurrentQuiz}
                onChange={(e) => setSelectCurrentQuiz(e.target.value)}
              >
                {allQuizzes !== [] &&
                  allQuizzes.map((quiz) => {
                    return (
                      <MenuItem key={quiz.id} value={quiz.id}>
                        {quiz.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <Button onClick={handleSetCurrentQuiz} variant={"contained"}>
              Set current quiz
            </Button>
          </Stack>
          <Stack spacing={2} width={"50%"} ml={1}>
            <FormControl fullWidth>
              <InputLabel id="quiz">Quiz</InputLabel>
              <Select
                id="quiz"
                label="quiz"
                value={selectLiveQuiz}
                onChange={(e) => setSelectQuiz(e.target.value)}
              >
                {allQuizzes !== [] &&
                  allQuizzes.map((quiz) => {
                    return (
                      <MenuItem key={quiz.id} value={quiz.id}>
                        {quiz.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <Button onClick={handleSetQuizActive} variant={"contained"}>
              Start live session
            </Button>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
}
