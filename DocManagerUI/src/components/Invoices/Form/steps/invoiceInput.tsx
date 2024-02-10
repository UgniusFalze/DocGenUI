import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { InvoiceForm } from "../../../../types/invoice";
import { Control, Controller } from "react-hook-form";
import { useClients } from "../../../../utils/apiService";
import { useAuth } from "react-oidc-context";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

export const InvoiceInput = (props: {
  control: Control<InvoiceForm, any, InvoiceForm>;
}) => {
  const user = useAuth();
  const { isLoading, isError, data, error } = useClients(
    user.user?.access_token
  );

  return (
    <Stack sx={{ width: "100%" }} direction="column" spacing={2}>
      <Controller
        name="clientId"
        control={props.control}
        render={({ field }) => (
          <FormControl>
            <InputLabel id="client-input-id">Client</InputLabel>
            <Select
              {...field}
              labelId="client-input-id"
              label="Client"
              value={field.value ?? ""}
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
        render={({ field }) => (
          <FormControl>
            <TextField {...field} label="Series Number" variant="outlined" />
          </FormControl>
        )}
      />
      <Controller
        name="dateOfCreation"
        control={props.control}
        render={({ field }) => (
          <FormControl>
              <DatePicker {...field} label="Invoice Date"></DatePicker>
          </FormControl>
        )}
      />
    </Stack>
  );
};
