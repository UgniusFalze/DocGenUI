import { Backdrop, CircularProgress, CssBaseline } from "@mui/material";

export const LoadingAuth = () => {
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
    </>
  );
};
