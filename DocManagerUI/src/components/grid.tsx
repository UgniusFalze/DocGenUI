import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GetGrid } from "../utils/invoiceGrid";
import { useAuth } from "react-oidc-context";
import { Box, LinearProgress, Modal, Typography } from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { InvoiceFormModal } from "./invoiceFormModal";
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
];

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function InvoiceGrid() {
  const user = useAuth();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["invoicesGrid", user.user?.access_token],
    queryFn: () => GetGrid(user.user!.access_token),
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <div>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <InvoiceFormModal></InvoiceFormModal>
      </Modal>
      <div style={{ height: "100%", width: "100%" }}>
        {isLoading ? <LinearProgress /> : ""}
        <DataGrid
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
