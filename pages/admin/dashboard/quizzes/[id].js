import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { database } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import TopNav from "../../../../components/Nav/TopNav";
import MultipleChoice from "../../../../components/Trivia/CreateQuiz/MultipleChoice";

export default function AddQuizQuestions({ data, id }) {
  return (
    <React.Fragment>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: "2em" }}>
        <Box>
          <Typography mb={2} variant="h5">
            <span style={{ fontWeight: 600 }}>Quiz:</span> {data.name}
          </Typography>
          <MultipleChoice quizId={id} />
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
