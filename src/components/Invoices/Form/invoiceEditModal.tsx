import {
  Autocomplete,
  Box,
  FormControl,
  Stack,
  TextField,
} from "@mui/material";
import { ClientSelect } from "../../../types/client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import {
  useClients,
  useGetShortInvoice,
  useUpdateInvoice,
} from "../../../utils/apiService";
import { SyntheticEvent, useEffect, useState } from "react";
import { GridRowModelUpdate } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import { ShortInvoicePost } from "../../../types/invoice";
import dayjs from "dayjs";

export const InvoiceEditModal = (props: {
  closeModal: () => void;
  invoiceId: number;
  updateInvoiceGrid: (updates: GridRowModelUpdate[]) => void;
}) => {
  const auth = useAuth();
  const invoice = useGetShortInvoice(auth.user!.access_token, props.invoiceId);
  const invoiceForm = useForm<ShortInvoicePost>({
    defaultValues: {
      seriesNumber: 0,
      invoiceClientId: 0,
      invoiceDate: dayjs(),
    },
    values: invoice.data,
    mode: "onChange",
  });

  const formMutation = useUpdateInvoice(
    auth.user!.access_token,
    props.invoiceId,
  );
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { data, isFetching } = useClients(auth.user?.access_token);

  const onSubmit: SubmitHandler<ShortInvoicePost> = async (data) => {
    //const _ = clientForm.formState.errors;
    await invoiceForm.trigger();
    if (invoiceForm.formState.isValid) {
      setIsLoadingButton(true);
      formMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (formMutation.isSuccess) {
      props.updateInvoiceGrid([
        { invoiceId: props.invoiceId, ...invoiceForm.getValues() },
      ]);
      props.closeModal();
    } else if (formMutation.isError) {
      setIsLoadingButton(false);
      if (formMutation.error.response?.status === 422)
        invoiceForm.setError("seriesNumber", {
          type: "custom",
          message:
            (formMutation.error.response?.data as string) ??
            "Duplicate series number",
        });
    }
  }, [formMutation.isSuccess, formMutation.isError]);

  return (
    <form onSubmit={invoiceForm.handleSubmit(onSubmit)}>
      <Stack sx={{ width: "100%" }} direction="column" spacing={2}>
        <Controller
          name="invoiceClientId"
          control={invoiceForm.control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl>
              <Autocomplete
                {...field}
                value={
                  data?.find((client) => client.id === field.value) ?? null
                }
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
                    error={!!invoiceForm.formState.errors.invoiceClientId}
                    helperText={invoiceForm.formState.errors.invoiceClientId?.message?.toString()}
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
          control={invoiceForm.control}
          rules={{ required: true, min: 1, pattern: /^[0-9]*$/ }}
          render={({ field }) => (
            <FormControl>
              <TextField
                {...field}
                inputProps={{ type: "number" }}
                error={!!invoiceForm.formState.errors.seriesNumber}
                helperText={invoiceForm.formState.errors.seriesNumber?.message?.toString()}
                label="Series Number"
                variant="outlined"
              />
            </FormControl>
          )}
        />
        <Controller
          name="invoiceDate"
          control={invoiceForm.control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl>
              <DatePicker {...field} label="Invoice Date"></DatePicker>
            </FormControl>
          )}
        />
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Box sx={{ flex: "1 1 auto" }} />
          <LoadingButton loading={isLoadingButton} type="submit">
            Save
          </LoadingButton>
        </Box>
      </Stack>
    </form>
  );
};
