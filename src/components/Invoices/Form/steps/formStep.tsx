import { Control } from "react-hook-form";
import { InvoiceForm } from "../../../../types/invoice";
import { InvoiceInput } from "./invoiceInput";
import { InvoiceItemInput } from "./invoiceItemsInput";

export const FormStep = (props:{stepNumber:number, control: Control<InvoiceForm>}) => {
    switch(props.stepNumber){
        case 0:
            return <InvoiceInput control={props.control}></InvoiceInput>
        case 1:
            return <InvoiceItemInput control={props.control}></InvoiceItemInput>
        default:
            return <></>
    }
}