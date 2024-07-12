import { Autocomplete, FormControl, Stack, TextField } from "@mui/material";
import { InvoiceForm } from "../../../../types/invoice";
import { Control, Controller, useFormContext } from "react-hook-form";
import { useClients } from "../../../../utils/apiService";
import { useAuth } from "react-oidc-context";
import { DatePicker } from "@mui/x-date-pickers";
import { SyntheticEvent } from "react";
import { ClientSelect } from "../../../../types/client";

export const InvoiceInput = (props: { control: Control<InvoiceForm> }) => {
  const user = useAuth();
  const { formState } = useFormContext();
  const { data, isFetching } = useClients(user.user?.access_token);

  return (
    <Stack sx={{ width: "100%" }} direction="column" spacing={2}>
      <Controller
        name="clientId"
        control={props.control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl>
            <Autocomplete
              {...field}
              value={data?.find((client) => client.id === field.value) ?? null}
              options={data ?? []}
              getOptionLabel={(option: ClientSelect) => option.label}
              getOptionKey={(option: ClientSelect) => option.id}
              autoSelect={true}
              onChange={(
                _: SyntheticEvent,
                value: { label: string; id: number } | null,
              ) => {
                if (value) {
                  field.onChange(value.id);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  error={!!formState.errors.clientId}
                  helperText={formState.errors.clientId?.message?.toString()}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
              loading={isFetching}
            />
          </FormControl>
        )}
      />
      <Controller
        name="seriesNumber"
        control={props.control}
        rules={{ required: true, min: 1, pattern: /^[0-9]*$/ }}
        render={({ field }) => (
          <FormControl>
            <TextField
              {...field}
              inputProps={{ type: "number" }}
              error={!!formState.errors.seriesNumber}
              helperText={formState.errors.seriesNumber?.message?.toString()}
              label="Series Number"
              variant="outlined"
            />
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
