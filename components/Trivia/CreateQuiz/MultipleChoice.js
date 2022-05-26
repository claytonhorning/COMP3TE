import React, { useState } from "react";
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
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useAlert } from "../../../context/AlertContext";

const MultipleChoice = ({ quizId }) => {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState({ id: 1, text: "", answer: false });
  const [option2, setOption2] = useState({ id: 2, text: "", answer: false });
  const [option3, setOption3] = useState({ id: 3, text: "", answer: false });
  const [option4, setOption4] = useState({ id: 4, text: "", answer: false });
  const [error, setError] = useState();
  const { setAlert } = useAlert();

  const quizRef = doc(database, "Quizzes", quizId);

  const getQuizQuestions = async () => {
    const quizQuestions = await getDoc(quizRef);

    if (quizQuestions.exists()) {
      const questions = quizQuestions.data().questions;
      return questions;
    } else {
      return;
    }
  };

  const handleCreateQuestion = async () => {
    if (
      question.length > 5 &&
      option1.text.length > 0 &&
      option2.text.length > 0 &&
      option3.text.length > 0 &&
      option4.text.length > 0
    ) {
      const questions = await getQuizQuestions();

      await setDoc(
        quizRef,
        {
          questions: [
            ...questions,
            {
              text: question,
              options: [option1, option2, option3, option4],
            },
          ],
        },
        { merge: true }
      );

      setAlert({ type: "success", message: "Question created" });

      setQuestion("");
      setOption1({ id: 1, text: "", answer: false });
      setOption2({ id: 2, text: "", answer: false });
      setOption3({ id: 3, text: "", answer: false });
      setOption4({ id: 4, text: "", answer: false });
    } else {
      setError("All inputs must be filled out ");
    }
  };

  return (
    <>
      <Stack spacing={4}>
        <Stack spacing={2}>
          <TextField
            sx={{ width: "50%" }}
            id="outlined-basic"
            label="Question"
            variant="outlined"
            multiline
            maxRows={4}
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
          />
          <Box sx={{ width: "50%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <TextField
                sx={{
                  flexGrow: 1,
                  marginRight: 1,
                  borderRadius: 1,
                  backgroundColor: option1.answer && "#d7f7d9",
                }}
                label="Option 1"
                variant="outlined"
                id="1"
                onChange={(e) =>
                  setOption1((prevState) => ({
                    ...prevState,
                    text: e.target.value,
                  }))
                }
                value={option1.text}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => {
                        setOption1((prevState) => ({
                          ...prevState,
                          answer: true,
                        }));
                        setOption2((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption3((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption4((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                      }}
                    >
                      <CheckIcon />
                    </Button>
                  ),
                }}
              />
              <TextField
                sx={{
                  flexGrow: 1,
                  marginRight: 1,
                  borderRadius: 1,
                  backgroundColor: option2.answer && "#d7f7d9",
                }}
                label="Option 2"
                variant="outlined"
                id="2"
                onChange={(e) =>
                  setOption2((prevState) => ({
                    ...prevState,
                    text: e.target.value,
                  }))
                }
                value={option2.text}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => {
                        setOption1((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption2((prevState) => ({
                          ...prevState,
                          answer: true,
                        }));
                        setOption3((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption4((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                      }}
                    >
                      <CheckIcon />
                    </Button>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                sx={{
                  flexGrow: 1,
                  marginRight: 1,
                  borderRadius: 1,
                  backgroundColor: option3.answer && "#d7f7d9",
                }}
                label="Option 3"
                variant="outlined"
                id="3"
                onChange={(e) =>
                  setOption3((prevState) => ({
                    ...prevState,
                    text: e.target.value,
                  }))
                }
                value={option3.text}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => {
                        setOption1((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption2((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption3((prevState) => ({
                          ...prevState,
                          answer: true,
                        }));
                        setOption4((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                      }}
                    >
                      <CheckIcon />
                    </Button>
                  ),
                }}
              />
              <TextField
                sx={{
                  flexGrow: 1,
                  marginRight: 1,
                  borderRadius: 1,
                  backgroundColor: option4.answer && "#d7f7d9",
                }}
                label="Option 4"
                variant="outlined"
                id="4"
                onChange={(e) =>
                  setOption4((prevState) => ({
                    ...prevState,
                    text: e.target.value,
                  }))
                }
                value={option4.text}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => {
                        setOption1((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption2((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption3((prevState) => ({
                          ...prevState,
                          answer: false,
                        }));
                        setOption4((prevState) => ({
                          ...prevState,
                          answer: true,
                        }));
                      }}
                    >
                      <CheckIcon />
                    </Button>
                  ),
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
      <Button onClick={handleCreateQuestion} sx={{ mt: 2 }} variant="contained">
        Add question
      </Button>
      {error && (
        <Typography mt={1} color="error">
          {error}
        </Typography>
      )}
    </>
  );
};

export default MultipleChoice;
