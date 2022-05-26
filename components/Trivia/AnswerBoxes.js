import React, { useState } from "react";
import { Box, Grid, Button, Stack } from "@mui/material";

export default function AnswerBoxes({ choices, active }) {
  const [selected, setSelected] = useState();

  const handleSelected = (id) => {
    setSelected(id);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}
    >
      <Stack spacing={2} sx={{ flexGrow: 1, marginRight: 2 }}>
        <AnswerBox
          onClick={() => handleSelected(choices[0].id)}
          selected={selected === choices[0]?.id ? true : false}
          answer={choices[0]?.answer}
          active={active}
        >
          {choices[0]?.text}
        </AnswerBox>
        <AnswerBox
          onClick={() => handleSelected(choices[1].id)}
          selected={selected === choices[1]?.id ? true : false}
          answer={choices[1]?.answer}
          active={active}
        >
          {choices[1]?.text}
        </AnswerBox>
      </Stack>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <AnswerBox
          onClick={() => handleSelected(choices[2].id)}
          selected={selected === choices[2]?.id ? true : false}
          answer={choices[2]?.answer}
          active={active}
        >
          {choices[2]?.text}
        </AnswerBox>
        <AnswerBox
          onClick={() => handleSelected(choices[3].id)}
          selected={selected === choices[3]?.id ? true : false}
          answer={choices[3]?.answer}
          active={active}
        >
          {choices[3]?.text}
        </AnswerBox>
      </Stack>
    </Box>
  );
}

const AnswerBox = ({ children, onClick, selected, active, answer }) => {
  const styles = {
    answerBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
      cursor: "pointer",
      width: "100%",
    },
  };
  return (
    <React.Fragment>
      {active ? (
        <Button
          onClick={onClick}
          variant={selected ? "contained" : "outlined"}
          sx={styles.answerBox}
        >
          {children}
        </Button>
      ) : (
        <Button
          onClick={onClick}
          variant={answer ? "contained" : "outlined"}
          color={answer ? "success" : "error"}
          sx={styles.answerBox}
        >
          {children}
        </Button>
      )}
    </React.Fragment>
  );
};
