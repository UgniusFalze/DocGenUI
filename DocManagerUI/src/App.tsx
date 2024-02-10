import { useAuth } from "react-oidc-context";
import { Menu } from "./components/menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {
  const auth = useAuth();
  console.log(auth.user?.access_token);

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated === false) {
    auth.signinRedirect();
  } else {
    return(
      <QueryClientProvider client={queryClient}>
        <Menu></Menu>
      </QueryClientProvider>
    );
  }
}

export default App;
