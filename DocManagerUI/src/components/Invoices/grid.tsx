import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowId,
} from "@mui/x-data-grid";
import { GetGrid } from "../../utils/invoiceGrid";
import { useAuth } from "react-oidc-context";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { InvoiceFormModal } from "./Form/invoiceFormModal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import { getSeriesNumber } from "../../utils/apiService";
import { Download } from "@mui/icons-material";
import { HandleDownload } from "../../utils/documentsCrud";
import { useNavigate } from "react-router-dom";

export default function InvoiceGrid() {
  const user = useAuth();
  const navigate = useNavigate();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["invoicesGrid", user.user?.access_token],
    queryFn: () => GetGrid(user.user!.access_token),
  });

  const onClick = (id: GridRowId) => {
    HandleDownload(Number.parseInt(id.toString()), user.user!.access_token);
  };
  const columns: GridColDef[] = [
    { field: "invoiceId", headerName: "ID", width: 70 },
    { field: "clientName", headerName: "Client Name", flex: 1 },
    {
      field: "invoiceDate",
      headerName: "Date",
      type: "date",
      valueGetter: ({ value }) => value && new Date(value),
      flex: 0.5,
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Download />}
          label="DownloadItem"
          onClick={() => onClick(params.id)}
        />,
      ],
    },
  ];

  const seriesNumber = getSeriesNumber(user.user!.access_token);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleInvoiceView:GridEventListener<"rowClick"> = (data) => {
    navigate("/invoices/"+data.id);
  }

  return (
    <div>
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>{"Add Invoice"}</DialogTitle>
        <DialogContent>
          <InvoiceFormModal
            invoiceFormNumber={seriesNumber.data}
            closeModal={handleModalClose}
          />
        </DialogContent>
      </Dialog>
      <div style={{ height: "100%", width: "100%" }}>
        <Typography gutterBottom variant="h3">Invoices</Typography>
        {isLoading ? <LinearProgress /> : null}
        <DataGrid
          
          disableRowSelectionOnClick
          onRowClick={handleInvoiceView}
          autoHeight
          rows={data ?? []}
          columns={columns}
          getRowId={(row) => row.invoiceId}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[15, 25]}
        />
      </div>
      <Fab
        onClick={() => handleModalOpen()}
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          margin: "35px 25px",
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
