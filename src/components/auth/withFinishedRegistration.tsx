import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { validUser } from "../../utils/apiService";
import { RegisterForm } from "../User/form/RegisterForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingAuth } from "../loadingAuth";

const queryClient = new QueryClient();
export function withFinishedRegistration<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
) {
  return (props: T) => {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isValid, setIsValid] = useState<boolean>(false);
    useEffect(() => {
      validUser(auth.user?.access_token).then((valid) => {
        setIsValid(valid);
        setIsLoading(false);
      });
    }, [auth.user?.access_token]);

    if (isLoading) {
      return <LoadingAuth />;
    } else {
      if (isValid) {
        return (
          <QueryClientProvider client={queryClient}>
            <Component {...props} />;
          </QueryClientProvider>
        );
      } else {
        return (
          <QueryClientProvider client={queryClient}>
            <RegisterForm setValid={setIsValid} />;
          </QueryClientProvider>
        );
      }
    }
  };
}
