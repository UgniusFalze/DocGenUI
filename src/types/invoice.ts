import { Dayjs } from "dayjs";
import { InvoiceItem, InvoicePostItem } from "./invoiceItem";

export type Invoice = {
  invoiceId: number;
  name: string;
  address: string;
  personalId: string;
  freelanceWorkId: string;
  bankNumber: string;
  bankName: string;
  buyerName: string;
  buyerAddress: string;
  buyerCode: string;
  totalMoney: string;
  products: InvoiceItem[];
};

export type InvoiceForm = {
  items: InvoicePostItem[];
  seriesNumber: number;
  clientId: number | null;
  dateOfCreation: Dayjs;
};

export type ShortInvoiceGet = ShortInvoice & {
  invoiceDate: string;
};

export type ShortInvoicePost = ShortInvoice & {
  invoiceDate: Dayjs;
};

export type ShortInvoice = {
  seriesNumber: number;
  invoiceClientId: number | null;
};

export type InvoiceGridRow = {
  invoiceId: number;
  invoiceDate: Date;
  clientName: string;
  totalSum: number;
};

export type InvoiceGrid = {
  invoices: Array<InvoiceGridRow>;
  invoicesTotal: number;
  isPayed: boolean;
};
