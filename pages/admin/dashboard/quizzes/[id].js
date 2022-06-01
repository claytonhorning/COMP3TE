import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { database } from "../../../../firebaseConfig";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import TopNav from "../../../../components/Nav/TopNav";
import MultipleChoice from "../../../../components/Trivia/CreateQuiz/MultipleChoice";
import { useRouter } from "next/router";
import { useAlert } from "../../../../context/AlertContext";
import { useAuth } from "../../../../context/AuthContext";

export default function AddQuizQuestions({ data, id }) {
  let currentQuestionRef = useRef(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const docRef = doc(database, "Quizzes", id);
  const router = useRouter();
  const { currentUser } = useAuth();

  const [errors, setErrors] = useState({});
  const { setAlert } = useAlert();

  const handleSetError = (input, msg) => {
    setErrors((prevState) => ({ ...prevState }, { [input]: msg }));
  };

  const handleSetQuizActive = async () => {
    const quizRef = doc(database, "Quizzes", id);

    await updateDoc(quizRef, { active: true, currentQuestion: 0 });
    setAlert({ type: "success", message: "Live event started!" });
  };

  const handleIncrementQuestion = async () => {
    currentQuestionRef.current = currentQuestionRef.current + 1;
    setCurrentQuestion((prevCount) => prevCount + 1);
    const quizRef = doc(database, "Quizzes", id);

    await updateDoc(quizRef, {
      currentQuestion: currentQuestionRef.current,
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, async (quizData) => {
      if (quizData.exists()) {
        setCurrentQuestion(quizData.data().currentQuestion);
        currentQuestionRef.current = quizData.data().currentQuestion;
      }
    });

    return unsubscribe;
  }, []);

  return (
    <React.Fragment>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: "2em" }}>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Typography mb={2} variant="h5">
              <span style={{ fontWeight: 600 }}>Quiz:</span> {data.name}
            </Typography>
            <MultipleChoice quizId={id} />
          </Box>

          <Box ml={5}>
            <Button
              sx={{ mt: 1 }}
              onClick={handleSetQuizActive}
              variant={"contained"}
            >
              Start live session
            </Button>
            {errors.liveQuiz !== "" && (
              <Typography mt={1} color="error">
                {errors.liveQuiz}
              </Typography>
            )}

            <Typography variant={"h6"}>
              Current question:{" "}
              {currentQuestion !== undefined
                ? currentQuestion + 1
                : "Quiz has not started"}
            </Typography>
            <Button
              onClick={handleIncrementQuestion}
              sx={{ mt: 1 }}
              variant={"contained"}
              color="success"
            >
              Next question
            </Button>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const docRef = doc(database, "Quizzes", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return { props: { data, id } };
}
