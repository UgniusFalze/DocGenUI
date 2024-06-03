import { LocalizationProvider } from "@mui/x-date-pickers";
import { withAuthenticationRequired } from "react-oidc-context";
import { AppMenu } from "../menu";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { withFinishedRegistration } from "./withFinishedRegistration";
import { LoadingAuth } from "../loadingAuth";
const PrivateRoute = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppMenu></AppMenu>
    </LocalizationProvider>
  );
};

const registeredRoute = () => {
  return withFinishedRegistration(PrivateRoute);
};

export default withAuthenticationRequired(registeredRoute(), {
  OnRedirecting: () => <LoadingAuth/>
});
