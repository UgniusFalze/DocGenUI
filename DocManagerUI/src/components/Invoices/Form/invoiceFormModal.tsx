import { Box, FormControl, Typography } from "@mui/material";
import InvoiceFormStepper from "./InvoiceFormStepper";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const InvoiceFormModal = (props:{closeModal: () => void, invoiceFormNumber: number|undefined}) => {
  return (
      <InvoiceFormStepper closeModal={props.closeModal} invoiceFormNumber={props.invoiceFormNumber}></InvoiceFormStepper>
  );
};
