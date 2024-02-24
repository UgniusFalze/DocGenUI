import { LocalizationProvider } from "@mui/x-date-pickers";
import { withAuthenticationRequired } from "react-oidc-context";
import { Menu } from "../menu";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { withFinishedRegistration } from "./withFinishedRegistration";
import { LoadingAuth } from "../loadingAuth";
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
  OnRedirecting: () => <LoadingAuth/>
});
