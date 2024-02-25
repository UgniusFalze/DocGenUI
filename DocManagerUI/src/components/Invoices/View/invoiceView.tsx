import { useAuth } from "react-oidc-context";
import { getInvoice } from "../../../utils/apiService";
import { useParams } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { InvoiceCard } from "./invoiceCard";

const columns: GridColDef[] = [
  { field: "invoiceItemId", headerName: "ID", width: 70 },
  { field: "name", headerName: "Item Name", flex: 0.5 },
  { field: "unitOfMeasurement", headerName: "Measured In", flex: 0.5 },
  { field: "units", headerName: "Number of items", flex: 0.5 },
  { field: "priceOfUnitMoney", headerName: "Price Of Unit", flex: 0.5 },
  { field: "totalMoney", headerName: "Total Price Of Item", flex: 0.2 },
];

export const InvoiceView = () => {
  const auth = useAuth();
  const { id } = useParams();
  const invoice = getInvoice(auth.user?.access_token, id);
  return (
    <Stack spacing={2} divider={<Divider />}>
      <Stack direction="row" spacing={2}>
        <InvoiceCard
          cardTitle="Invoice Buyer"
          mainData={invoice.data?.buyerName}
          subTitle={invoice.data?.buyerCode}
        />
        <InvoiceCard
          cardTitle="Invoice Seller"
          mainData={invoice.data?.name}
          subTitle={invoice.data?.freelanceWorkId}
        />
        <InvoiceCard
          cardTitle="Total Price"
          mainData={invoice.data?.totalMoney}
          subTitle="EUR"
        />
      </Stack>
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          disableRowSelectionOnClick
          autoHeight
          rows={invoice.data?.products ?? []}
          columns={columns}
          getRowId={(row) => row.invoiceItemId}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[15, 25]}
        />
      </div>
    </Stack>
  );
};
