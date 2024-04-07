import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { InvoiceForm } from "../../../../types/invoice";
import { Control, Controller, get, useFormContext } from "react-hook-form";
import { useClients } from "../../../../utils/apiService";
import { useAuth } from "react-oidc-context";
import { DatePicker } from "@mui/x-date-pickers";

export const InvoiceInput = (props: {
  control: Control<InvoiceForm>;
}) => {
  const user = useAuth();
  const {formState} = useFormContext();
  const { isLoading, isError, data, error } = useClients(
    user.user?.access_token
  );

  return (
    <Stack sx={{ width: "100%" }} direction="column" spacing={2}>
      <Controller
        name="clientId"
        control={props.control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl>
            <InputLabel id="client-input-id">Client</InputLabel>
            <Select
              {...field}
              labelId="client-input-id"
              label="Client"
              value={field.value ?? ""}
              error={!!formState.errors.clientId}
            >
              {data?.map((client) => {
                return (
                  <MenuItem key={client.clientId} value={client.clientId}>
                    {client.clientName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="seriesNumber"
        control={props.control}
        rules={{ required: true, min:1, pattern:/^[0-9]*$/}}
        render={({ field }) => (
          <FormControl>
            <TextField 
            {...field}
            inputProps={{type:"number"}}
            error={!!formState.errors.seriesNumber}
            helperText={formState.errors.seriesNumber?.message?.toString()}
            label="Series Number" 
            variant="outlined" />
          </FormControl>
        )}
      />
      <Controller
        name="dateOfCreation"
        control={props.control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl>
            <DatePicker {...field} label="Invoice Date"></DatePicker>
          </FormControl>
        )}
      />
    </Stack>
  );
};
