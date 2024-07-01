export type InvoiceItem = {
  invoiceItemId: number|null;
  name: string;
  unitOfMeasurement: string;
  units: number;
  priceOfUnit: number;
  realId:number;
};

export type InvoicePostItem = {
  name: string;
  unitOfMeasurement: string;
  units: number;
  priceOfUnit: number;
}