import { Control } from "react-hook-form";
import { InvoiceForm } from "../../../../types/invoice";
import { InvoiceInput } from "./invoiceInput";

export const FormStep = (props:{stepNumber:number, control: Control<InvoiceForm, any, InvoiceForm>}) => {
    switch(props.stepNumber){
        case 0:
            return <InvoiceInput control={props.control}></InvoiceInput>
        default:
            return <></>
    }
}