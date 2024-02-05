import { InvoiceItem } from "./invoiceItem"

export type Invoice = {
    invoiceId: number,
    name: string,
    address: string,
    personalId: string,
    freelanceWorkId: string,
    bankNumber: string,
    bankName: string,
    buyerName: string,
    buyerAddress: string,
    buyerCode: string,
    items: InvoiceItem[]
}