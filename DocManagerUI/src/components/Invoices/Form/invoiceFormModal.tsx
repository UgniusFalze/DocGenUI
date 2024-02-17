import InvoiceFormStepper from "./InvoiceFormStepper";

export const InvoiceFormModal = (props:{closeModal: () => void, invoiceFormNumber: number|undefined}) => {
  return (
      <InvoiceFormStepper closeModal={props.closeModal} invoiceFormNumber={props.invoiceFormNumber}></InvoiceFormStepper>
  );
};
