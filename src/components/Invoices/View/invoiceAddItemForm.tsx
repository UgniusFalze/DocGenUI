import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonGroup, FormControl, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { InvoicePostItem } from "../../../types/invoiceItem";
import { useAddInvoiceItem } from "../../../utils/apiService";
import { LoadingButton } from "@mui/lab";

export const InvoiceItemInput = (props: {
  invoiceId: number | null | undefined;
  setValid: (valid: boolean) => void;
}) => {
  const user = useAuth();
  const formMutation = useAddInvoiceItem(
    user.user?.access_token,
    props.invoiceId,
  );
  const invoiceForm = useForm<InvoicePostItem>({
    defaultValues: {
      name: "",
      unitOfMeasurement: "vnt",
      units: 0,
      priceOfUnit: 0,
    },
  });

  const [isLoadingButton, setIsLoadingButton] = useState(false);

  useEffect(() => {
    if (formMutation.isSuccess) {
      props.setValid(true);
    }
  }, [formMutation.isSuccess]);

  const onSubmit: SubmitHandler<InvoicePostItem> = async (data) => {
    //const _ = userRegisterForm.formState.errors;
    await invoiceForm.trigger();
    if (invoiceForm.formState.isValid) {
      setIsLoadingButton(true);
      formMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={invoiceForm.handleSubmit(onSubmit)}>
      <Stack
        sx={{
          padding: "2em",
        }}
        gap={2}
      >
        <Controller
          name="name"
          control={invoiceForm.control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl>
              <TextField
                {...field}
                error={!!invoiceForm.formState.errors.name}
                label="Item Name"
                variant="outlined"
              />
            </FormControl>
          )}
        />
        <Controller
          name="units"
          control={invoiceForm.control}
          rules={{ required: true, pattern: /^[0-9]*$/, min: 1 }}
          render={({ field }) => (
            <FormControl>
              <TextField
                {...field}
                error={!!invoiceForm.formState.errors.units}
                helperText={!!invoiceForm.formState.errors.units?.message}
                inputProps={{ type: "number" }}
                label="Quantity"
                variant="outlined"
              />
            </FormControl>
          )}
        />
        <Controller
          name="priceOfUnit"
          control={invoiceForm.control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <FormControl>
              <TextField
                {...field}
                error={!!invoiceForm.formState.errors.priceOfUnit}
                helperText={!!invoiceForm.formState.errors.priceOfUnit?.message}
                inputProps={{ type: "number" }}
                label="Price"
                variant="outlined"
              />
            </FormControl>
          )}
        />
        <ButtonGroup variant="text" sx={{ justifyContent: "flex-end" }}>
          <LoadingButton loading={isLoadingButton} type="submit">
            Save
          </LoadingButton>
        </ButtonGroup>
      </Stack>
    </form>
  );
};
