export type ClientSelect = {
  id: number;
  label: string;
};

export type ClientForm = {
  buyerName: string;
  buyerAddress: string;
  buyerCode: string;
  vatCode: string | null;
};

export type ClientGridRow = ClientForm & {
  clientId: number;
};
