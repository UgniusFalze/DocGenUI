import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { getLoginServiceUrl, getRedirectUriFromLogin } from "./utils/envProvider.ts";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
          "input[type=number]": {
            MozAppearance: "textfield",
          },
        },
      },
    },
  },
});

const oidConfig: AuthProviderProps = {
  authority: getLoginServiceUrl(),
  client_id: "DocsManagementReact",
  redirect_uri: getRedirectUriFromLogin(),
  response_type: "code",
  scope: "openid",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider {...oidConfig}>
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);
