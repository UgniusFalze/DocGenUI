import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { InvoiceForm } from "../../../types/invoice";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormStep } from "./steps/formStep";
import { Container } from "@mui/material";
import dayjs from "dayjs";
import { useAuth } from "react-oidc-context";
import { useAddPost } from "../../../utils/apiService";
import { LoadingButton } from "@mui/lab";

const steps = ["Create an invoice", "Add items to the invoice"];

const defaultInvoice = {
  clientId: null,
  dateOfCreation: dayjs(),
  items: [
    {
      name: "",
      unitOfMeasurement: "vnt.",
      units: 0,
      priceOfUnit: 0,
    },
  ],
};

export default function InvoiceFormStepper(props: {
  closeModal: () => void;
  invoiceFormNumber: number | undefined;
}) {
  const [activeStep, setActiveStep] = useState(0);

  const invoiceForm = useForm<InvoiceForm>({
    defaultValues: {
      ...defaultInvoice,
      seriesNumber: (props.invoiceFormNumber ?? 1) + 1,
    },
    mode: "onChange",
  });

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const auth = useAuth();

  const formMutation = useAddPost(auth.user!.access_token);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (formMutation.isSuccess) {
      props.closeModal();
    } else if (formMutation.isError) {
      setButtonLoading(false);
      if (formMutation.error.response?.status === 422) {
        invoiceForm.setError("seriesNumber", {
          type: "custom",
          message:
            (formMutation.error.response.data as string) ??
            "Invoice with series number already exists",
        });

        setActiveStep(0);
      }
    }
  }, [formMutation.isSuccess, formMutation.isError]);

  const handleClick = async () => {
    const trigger = await invoiceForm.trigger();
    if (trigger) {
      handleNext();
    }
  };

  const onSubmit: SubmitHandler<InvoiceForm> = (data) => {
    if (invoiceForm.formState.isValid) {
      setButtonLoading(true);
      formMutation.mutate(data);
    }
    invoiceForm.reset(
      { ...data },
      {
        keepErrors: true,
      },
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <FormProvider {...invoiceForm}>
        <form onSubmit={invoiceForm.handleSubmit(onSubmit)}>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button onClick={handleReset}>Reset</Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <LoadingButton
                  key={"buttonSubmit"}
                  type="submit"
                  loading={buttonLoading}
                >
                  Save
                </LoadingButton>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Container sx={{ my: 2, minWidth: "100%", alignItems: "center" }}>
                <FormStep
                  control={invoiceForm.control}
                  stepNumber={activeStep}
                ></FormStep>
              </Container>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button type="button" onClick={handleClick}>
                  Next
                </Button>
              </Box>
            </React.Fragment>
          )}
        </form>
      </FormProvider>
    </Box>
  );
}
