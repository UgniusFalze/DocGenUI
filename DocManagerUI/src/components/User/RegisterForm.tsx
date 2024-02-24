import {
  Box,
  Button,
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
import { UserForm } from "../../types/user";
import { useAuth } from "react-oidc-context";
import { addUser } from "../../utils/apiService";

export const RegisterForm = () => {
  const user = useAuth();
  const formMutation = addUser(user.user?.access_token);
  const userRegisterForm = useForm<UserForm>({
    defaultValues: {
      address: "",
      personalId: "",
      freelanceWorkId: "",
      bankNumber: "",
      bankName: "",
    },
  });

  const handleLogout = async () => {
    user.removeUser();
    user.signoutRedirect({
      post_logout_redirect_uri: "http://localhost:5173/",
    });
  };

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    if (userRegisterForm.formState.isValid) {
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
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      error={!!userRegisterForm.formState.errors.personalId}
                      label="National Identification Number"
                      variant="outlined"
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="freelanceWorkId"
                control={userRegisterForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      error={
                        !!userRegisterForm.formState.errors.freelanceWorkId
                      }
                      label="Freeelance Work Id"
                      variant="outlined"
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
              <Button
                variant="contained"
                sx={{
                  padding: "1em",
                }}
                type="submit"
              >
                Register
              </Button>
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
