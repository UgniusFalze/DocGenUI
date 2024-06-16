import { useAuth } from "react-oidc-context";
import { useGetInvoice } from "../../../utils/apiService";
import { useParams } from "react-router-dom";
import { DataGrid, GridActionsCellItem, GridColDef, GridDeleteIcon, GridRowId, useGridApiRef } from "@mui/x-data-grid";
import {
  Box,
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
import { WarningOutlined } from "@mui/icons-material";
import { InvoiceItemDeleteModal } from "../Form/InvoiceDeleteItemModal";

export const InvoiceView = () => {
  const apiRef = useGridApiRef();
  const auth = useAuth();
  const { id } = useParams();
  const { data: invoiceData, refetch, isFetched, isFetching } = useGetInvoice(auth.user?.access_token, id);
  const [data, setData] = useState<string | undefined>(undefined);
  const [itemModalOpen, setItemModalOpen] = useState<boolean>(false);
  const [successfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string | JSX.Element>("");
  const [gridModal, setGridModal] = useState<JSX.Element | null>(null);


  useEffect(() => {
    if (id !== undefined) {
      createFileObjectUrl(id, auth.user!.access_token).then((data) => {
        setData(data);
      })
    }
  }, [id, successfullAdd]);

  useEffect(() => {
    if (isFetched) {
      setAddButtonVisible(true);
    }
  }, [isFetching])

  const closeModal = () => {
    setItemModalOpen(false);
  }

  const openModal = () => {
    setItemModalOpen(true);
  }

  const updateGrid = (valid: boolean) => {
    if (valid) {
      refetch();
      setData(undefined);
      setSuccessfullAdd(true);
      closeModal();
    }
  }

  const columns: GridColDef[] = [
    { field: "invoiceItemId", headerName: "ID", width: 70 },
    { field: "name", headerName: "Item Name", flex: 0.5 },
    { field: "unitOfMeasurement", headerName: "Measured In", flex: 0.5 },
    { field: "units", headerName: "Number of items", flex: 0.5 },
    { field: "priceOfUnitMoney", headerName: "Price Of Unit", flex: 0.5 },
    { field: "totalMoney", headerName: "Total Price Of Item", flex: 0.5 },
    {
      field: 'deleteAction', type: "actions", getActions: (params) => [
        <GridActionsCellItem
          icon={<GridDeleteIcon />}
          label="Delete Invoice Item"
          onClick={() => handleInvoiceDeleteItem(params.id)}
        />,
      ],
    }
  ];

  const handleInvoiceDeleteItem = (invoiceItemId: GridRowId) => {
    const parsedId = Number.parseInt(invoiceItemId.toString());
    const parsedInvoiceId = Number.parseInt(id?.toString() ?? '0');
    setModalTitle(<Box width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}><WarningOutlined fontSize="large"></WarningOutlined></Box>);
    setGridModal(<InvoiceItemDeleteModal handleModalClose={closeModal} invoiceItemId={parsedId} invoiceId={parsedInvoiceId} updateInvoice={update}></InvoiceItemDeleteModal>);
    openModal();
  }

  const handleAddInvoiceItem = () => {
    setModalTitle("Add Item");
    setGridModal(<InvoiceItemInput setValid={updateGrid} invoiceId={Number.parseInt(id ?? '')}></InvoiceItemInput>);
    openModal();
  }

  const update = () => {
    updateGrid(true);
  }

  return (
    <Grid container justifyContent={"center"} direction="row" spacing={2}>
      <GridModal
        isModalOpen={itemModalOpen}
        handleModalClose={closeModal}
        handleContentClose={update}
        title={modalTitle}
        modalContent={gridModal}>
      </GridModal>
      <Grid item maxWidth="md">
        <Typography gutterBottom variant="h3">
          Invoice
        </Typography>
        <Stack spacing={2} divider={<Divider />}>
          <Stack direction="row" spacing={2}>
            <InvoiceCard
              cardTitle="Invoice Buyer"
              mainData={invoiceData?.buyerName}
              subTitle={invoiceData?.buyerCode}
            />
            <InvoiceCard
              cardTitle="Invoice Seller"
              mainData={invoiceData?.name}
              subTitle={invoiceData?.freelanceWorkId}
            />
            <InvoiceCard
              cardTitle="Total Price"
              mainData={invoiceData?.totalMoney}
              subTitle="EUR"
            />
          </Stack>
          <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            {addButtonVisible ? <Button variant="contained" sx={{ marginBottom: "0.5rem", alignSelf: "end" }} onClick={handleAddInvoiceItem}>Add Item</Button> : <></>}
            <DataGrid
              loading={isFetching}
              apiRef={apiRef}
              disableRowSelectionOnClick
              autoHeight
              rows={invoiceData?.products ?? []}
              columns={columns}
              getRowId={(row) => row.realId}
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
      <Grid item sx={{ minWidth: "60%", height: "90vh" }} >
        {data !== undefined ? <PdfFile data={data} /> : <LinearProgress sx={{ width: '100%' }} />}
      </Grid>
    </Grid>
  );
};
