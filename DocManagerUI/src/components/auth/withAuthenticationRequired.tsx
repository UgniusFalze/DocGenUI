import { LocalizationProvider } from "@mui/x-date-pickers";
import { withAuthenticationRequired } from "react-oidc-context";
import { Menu } from "../menu";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { withFinishedRegistration } from "./withFinishedRegistration";
const PrivateRoute = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Menu></Menu>
    </LocalizationProvider>
  );
};

const registeredRoute = () => {
  return withFinishedRegistration(PrivateRoute);
};

export default withAuthenticationRequired(registeredRoute(), {
  OnRedirecting: () => <div>Redirecting to the login page...</div>,
});
