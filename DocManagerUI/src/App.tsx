import { useAuth } from "react-oidc-context";
import WithAuthenticationRequired from "./components/auth/withAuthenticationRequired";
import { LoadingAuth } from "./components/loadingAuth";

function App() {
  const auth = useAuth();

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
