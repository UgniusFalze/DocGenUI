import { Alert, Snackbar } from "@mui/material";

export const ErrorToast = (props: {
  open: boolean;
  message: string | null;
  onClose: () => void;
}) => {
  return (
    <Snackbar open={props.open} autoHideDuration={5000} onClose={props.onClose}>
      <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
        {props.message ?? "Internal server error has occured!"}
      </Alert>
    </Snackbar>
  );
};
