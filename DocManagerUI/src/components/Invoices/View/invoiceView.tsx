import { useAuth } from "react-oidc-context";
import { useGetInvoice } from "../../../utils/apiService";
import { useParams } from "react-router-dom";
import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";
import {
  Button,
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
import { GridModal } from "../../modals/gridModal";
import { InvoiceItemInput } from "./invoiceAddItemForm";

const columns: GridColDef[] = [
  { field: "invoiceItemId", headerName: "ID", width: 70 },
  { field: "name", headerName: "Item Name", flex: 0.5 },
  { field: "unitOfMeasurement", headerName: "Measured In", flex: 0.5 },
  { field: "units", headerName: "Number of items", flex: 0.5 },
  { field: "priceOfUnitMoney", headerName: "Price Of Unit", flex: 0.5 },
  { field: "totalMoney", headerName: "Total Price Of Item", flex: 0.5 },
];

export const InvoiceView = () => {
  const apiRef = useGridApiRef();
  const auth = useAuth();
  const { id } = useParams();
  const invoice = useGetInvoice(auth.user?.access_token, id);
  const [data, setData] = useState<string|undefined>(undefined);
  const [itemModalOpen, setItemModalOpen] = useState<boolean>(false);
  const [successfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(false);

  useEffect(() => {
    if(id !== undefined){
      createFileObjectUrl(id, auth.user!.access_token).then((data) => {
        setData(data);
      })
    }
  }, [id, successfullAdd]);

  useEffect(() => {
      if(invoice.isFetched){
        setAddButtonVisible(true);
      }
  }, [invoice.isFetching])

  const closeModal = () => {
    setItemModalOpen(false);
  }

  const updateGrid = (valid:boolean) => {
    if(valid){
      invoice.refetch();
      setData(undefined);
      setSuccessfullAdd(true);
      closeModal();
    }
  }

  const update = () => {

  }

  return (
    <Grid container justifyContent={"center"} direction="row" spacing={2}>
      <GridModal 
        isModalOpen={itemModalOpen} 
        handleModalClose={closeModal} 
        handleContentClose={update} 
        title="Add Item"
        modalContent={<InvoiceItemInput setValid={updateGrid} invoiceId={Number.parseInt(id ?? '')}></InvoiceItemInput>}>
        </GridModal>
      <Grid item maxWidth="md">
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
          <div style={{ display:"flex", flexDirection:"column", height: "100%", width: "100%" }}>
            {addButtonVisible ?<Button variant="contained" sx={{marginBottom:"0.5rem", alignSelf:"end"}} onClick={() => setItemModalOpen(true)}>Add Item</Button>:<></>}
            <DataGrid
              apiRef={apiRef}
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
      </Grid>
      <Grid item sx={{minWidth:"60%", height: "90vh"}} >
        {data !== undefined ? <PdfFile data={data} /> : <LinearProgress sx={{width:'100%'}} />}
      </Grid>
    </Grid>
  );
};
