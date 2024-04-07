import { Box, Button, FormControl, Stack, TextField } from "@mui/material";
import { ClientForm } from "../../../types/client";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { useClient } from "../../../utils/apiService";
import { getDefaultClientForm } from "./form";

export const ClientEditFormModal = (props: { closeModal: () => void , clientId: number}) => {
    const auth = useAuth();
    const client = useClient(auth.user!.access_token, props.clientId);
    const clientForm = useForm<ClientForm>({
      defaultValues: getDefaultClientForm(),
      values: client.data,
      mode:"onChange"
    });



    return (
        <form>
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
          <Button type="submit">Save</Button>
        </Box>
      </Stack>
    </form>
    )
}