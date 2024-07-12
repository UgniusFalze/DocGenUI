import { Box, FormControl, Stack, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ClientForm } from "../../../types/client";
import { useAddClient } from "../../../utils/apiService";
import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { getDefaultClientForm } from "./form";
import { ErrorToast } from "../../toasts/ErrorToast";
import { LoadingButton } from "@mui/lab";

export const ClientFormModal = (props: {
  closeModal: () => void;
  addClient: () => void;
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const auth = useAuth();
  const clientForm = useForm<ClientForm>({
    defaultValues: getDefaultClientForm(),
    mode: "onChange",
  });

  const formMutation = useAddClient(auth.user!.access_token);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const onSubmit: SubmitHandler<ClientForm> = async (data) => {
    //const _ = clientForm.formState.errors;
    await clientForm.trigger();
    if (clientForm.formState.isValid) {
      setIsLoadingButton(true);
      formMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (formMutation.isSuccess) {
      setHasError(false);
      props.addClient();
      props.closeModal();
    } else if (formMutation.isError) {
      setIsLoadingButton(false);
      setHasError(true);
    }
  }, [formMutation.isSuccess, formMutation.isError]);

  return (
    <>
      <ErrorToast
        open={hasError}
        onClose={() => setHasError(false)}
        message={"Failed to save client"}
      />
      <form onSubmit={clientForm.handleSubmit(onSubmit)}>
        <Stack
          sx={{ width: "100%", padding: "5px" }}
          direction="column"
          spacing={2}
        >
          <Controller
            rules={{ required: true }}
            name="buyerName"
            render={({ field }) => (
              <FormControl>
                <TextField
                  {...field}
                  label="Client's name"
                  error={!!clientForm.formState.errors.buyerName}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            )}
            control={clientForm.control}
          />
          <Controller
            rules={{ required: true }}
            name="buyerAddress"
            render={({ field }) => (
              <FormControl>
                <TextField
                  {...field}
                  label="Client's Address"
                  error={!!clientForm.formState.errors.buyerAddress}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            )}
            control={clientForm.control}
          />
          <Controller
            rules={{ required: true }}
            name="buyerCode"
            render={({ field }) => (
              <FormControl>
                <TextField
                  {...field}
                  label="Client's registration code"
                  error={!!clientForm.formState.errors.buyerCode}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            )}
            control={clientForm.control}
          />
          <Controller
            name="vatCode"
            render={({ field }) => (
              <FormControl>
                <TextField
                  {...field}
                  label="Client's VAT code (optional)"
                  variant="outlined"
                  error={!!clientForm.formState.errors.vatCode}
                  fullWidth
                />
              </FormControl>
            )}
            control={clientForm.control}
          />
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <LoadingButton loading={isLoadingButton} type="submit">
              Save
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </>
  );
};
