import { Dayjs } from "dayjs"
import { InvoiceItem, InvoicePostItem } from "./invoiceItem"

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
    totalMoney:string,
    products: InvoiceItem[]
}

export type InvoiceForm = {
    seriesNumber : number,
    clientId : number | null,
    dateOfCreation : Dayjs,
    items : InvoicePostItem[]
}

export type InvoiceGridRow = {
    invoiceId : number,
    invoiceDate : Date,
    clientName : string,
    totalSum: number
}

export type InvoiceGrid = {
    invoices: Array<InvoiceGridRow>,
    invoicesTotal: number
}