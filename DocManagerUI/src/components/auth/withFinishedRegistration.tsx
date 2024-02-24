import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { validUser } from "../../utils/apiService";
import { RegisterForm } from "../User/RegisterForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export function withFinishedRegistration<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>
) {
  return (props: T) => {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isValid, setIsValid] = useState<boolean>(false);
    console.log(auth.user?.access_token);
    useEffect(() => {
      validUser(auth.user?.access_token).then((valid) => {
        setIsValid(valid);
        setIsLoading(false);
      });
    }, []);

    if (isLoading) {
      return <div>Loading...</div>;
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
            <RegisterForm />;
          </QueryClientProvider>
        );
      }
    }
  };
}
