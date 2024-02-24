import { useAuth } from "react-oidc-context";
import { Menu } from "./components/menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { validUser } from "./utils/apiService";
import { useState } from "react";
import { RegisterForm } from "./components/User/RegisterForm";
import WithAuthenticationRequired from "./components/auth/withAuthenticationRequired";
import { LoadingAuth } from "./components/loadingAuth";

function App() {
  const auth = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <LoadingAuth />;
    case "signoutRedirect":
      return <LoadingAuth />;
  }
  if (auth.isLoading) {
    return <LoadingAuth />;
  } else if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  } else {
    return <WithAuthenticationRequired />;
  }
}

export default App;
