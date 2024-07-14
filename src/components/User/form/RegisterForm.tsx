import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserForm } from "../../../types/user";
import { useAuth } from "react-oidc-context";
import { useAddUser } from "../../../utils/apiService";
import { useEffect, useState } from "react";
import { getRedirectUriFromLogin } from "../../../utils/envProvider";
import { LoadingButton } from "@mui/lab";

export const RegisterForm = (props: {
  setValid: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useAuth();
  const formMutation = useAddUser(user.user?.access_token);
  const userRegisterForm = useForm<UserForm>({
    defaultValues: {
      address: "",
      personalId: "",
      freelanceWorkId: "",
      bankNumber: "",
      bankName: "",
    },
  });

  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const handleLogout = async () => {
    user.removeUser();
    user.signoutRedirect({
      post_logout_redirect_uri: getRedirectUriFromLogin(),
    });
  };

  useEffect(() => {
    if (formMutation.isSuccess) {
      props.setValid(true);
    }
  }, [formMutation.isSuccess]);

  const onSubmit: SubmitHandler<UserForm> = async (data) => {
    //const _ = userRegisterForm.formState.errors;
    await userRegisterForm.trigger();
    if (userRegisterForm.formState.isValid) {
      setIsLoadingButton(true);
      formMutation.mutate(data);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Container
        sx={{
          height: "min-content",
        }}
      >
        <Paper>
          <form onSubmit={userRegisterForm.handleSubmit(onSubmit)}>
            <Stack
              sx={{
                padding: "2em",
              }}
              gap={2}
            >
              <Typography
                sx={{
                  textAlign: "center",
                }}
                variant="h3"
              >
                Finish Setting Up Your Account
              </Typography>
              <Controller
                name="address"
                control={userRegisterForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      error={!!userRegisterForm.formState.errors.address}
                      label="Home Address"
                      variant="outlined"
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="personalId"
                control={userRegisterForm.control}
                rules={{ required: true, pattern: /^[0-9]*$/, min: 1 }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      error={!!userRegisterForm.formState.errors.personalId}
                      label="National Identification Number"
                      variant="outlined"
                      inputProps={{ type: "number" }}
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="freelanceWorkId"
                control={userRegisterForm.control}
                rules={{ required: true, pattern: /^[0-9]*$/, min: 1 }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      error={
                        !!userRegisterForm.formState.errors.freelanceWorkId
                      }
                      label="Freeelance Work Id"
                      variant="outlined"
                      inputProps={{ type: "number" }}
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="bankNumber"
                control={userRegisterForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      error={!!userRegisterForm.formState.errors.bankNumber}
                      label="Bank Account Number"
                      variant="outlined"
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="bankName"
                control={userRegisterForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      error={!!userRegisterForm.formState.errors.bankName}
                      label="Bank Name"
                      variant="outlined"
                    />
                  </FormControl>
                )}
              />
              <LoadingButton
                loading={isLoadingButton}
                variant="contained"
                sx={{
                  padding: "1em",
                }}
                type="submit"
              >
                Register
              </LoadingButton>
            </Stack>
          </form>
        </Paper>
        <Typography
          sx={{
            textAlign: "center",
          }}
          variant="overline"
          display="block"
        >
          Want to register later?{" "}
          <Link
            sx={{
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Logout
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};
