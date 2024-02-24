import { Box, Button, FormControl, Stack, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ClientForm } from "../../../types/client";
import { addClient } from "../../../utils/apiService";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export const ClientFormModal = (props: { closeModal: () => void }) => {
  const auth = useAuth();
  const clientForm = useForm<ClientForm>({
    defaultValues: {
      buyerName: "",
      buyerAddress: "",
      buyerCode: 0,
      vatCode:undefined
    },
  });

  const formMutation = addClient(auth.user!.access_token);

  const onSubmit: SubmitHandler<ClientForm> = (data) => {
    if (clientForm.formState.isValid) {
      formMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (formMutation.isSuccess) {
      props.closeModal();
    }
  }, [formMutation.isSuccess]);

  return (
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
                fullWidth
              />
            </FormControl>
          )}
          control={clientForm.control}
        />
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button type="submit">Save</Button>
        </Box>
      </Stack>
    </form>
  );
};
