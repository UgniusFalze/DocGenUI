import { useAuth } from "react-oidc-context";
import { useGetInvoice } from "../../../utils/apiService";
import { useParams } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { InvoiceCard } from "./invoiceCard";
import { PdfFile } from "./pdfFile";
import { useEffect, useState } from "react";
import { createFileObjectUrl } from "../../../utils/documentsCrud";

const columns: GridColDef[] = [
  { field: "invoiceItemId", headerName: "ID", width: 70 },
  { field: "name", headerName: "Item Name", flex: 0.5 },
  { field: "unitOfMeasurement", headerName: "Measured In", flex: 0.5 },
  { field: "units", headerName: "Number of items", flex: 0.5 },
  { field: "priceOfUnitMoney", headerName: "Price Of Unit", flex: 0.5 },
  { field: "totalMoney", headerName: "Total Price Of Item", flex: 0.5 },
];

export const InvoiceView = () => {
  const auth = useAuth();
  const { id } = useParams();
  const invoice = useGetInvoice(auth.user?.access_token, id);
  const [data, setData] = useState<string|undefined>(undefined);

  useEffect(() => {
    if(id !== undefined){
      createFileObjectUrl(id, auth.user!.access_token).then((data) => {
        setData(data);
      })
    }
  }, [id]);



  return (
    <Grid container direction="row" sx={{height: "90vh"}} spacing={2}>
      <Container maxWidth="md">
        <Typography gutterBottom variant="h3">
          Invoice
        </Typography>
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
              getRowHeight={() => 'auto'}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 15 },
                },
              }}
              pageSizeOptions={[15, 25]}
            />
          </div>
        </Stack>
      </Container>
      <Container fixed  sx={{minWidth:"60%"}}>
        {data !== undefined ? <PdfFile data={data} /> : <LinearProgress sx={{width:'100%'}} />}
      </Container>
    </Grid>
  );
};
