import { useAuth } from "react-oidc-context";
import { Menu } from "./components/menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { validUser } from "./utils/apiService";
import { useState } from "react";
import { RegisterForm } from "./components/User/RegisterForm";
import WithAuthenticationRequired from "./components/auth/withAuthenticationRequired";


function App() {
  const auth = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }
  else if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }else{
    return <WithAuthenticationRequired/>;
  }
}

export default App;
