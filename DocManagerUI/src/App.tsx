import { useAuth } from "react-oidc-context";
import WithAuthenticationRequired from "./components/auth/withAuthenticationRequired";
import { LoadingAuth } from "./components/loadingAuth";
import { UnreachableAuth } from "./components/auth/unreachableAuth";

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
    return <UnreachableAuth errorMessage={auth.error.message}></UnreachableAuth>
  } else {
    return <WithAuthenticationRequired />;
  }
}

export default App;
