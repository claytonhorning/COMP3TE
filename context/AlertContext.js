import React, { createContext, useState, useContext } from "react";
import { Alert, Snackbar, Button, IconButton } from "@mui/material";
import { CloseIcon } from "@mui/icons-material";

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [alert, setAlert] = useState({ type: "", message: "" });
  const value = { setAlert };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alert.message !== "" && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          action={action}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity={alert.type}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
}
