import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "react-oidc-context";
import { useClients } from "../../utils/apiService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ClientFormModal } from "./Form/clientsFormModal";

export const ClientsGrid = () => {
  const user = useAuth();
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const { isLoading, data } = useClients(user.user?.access_token);
  const columns: GridColDef[] = [
    { field: "clientId", headerName: "ID", width: 70 },
    { field: "clientName", headerName: "Client Name", flex: 1 },
  ];
  const handleModalOpen = () => setFormModalOpen(true);
  const handleModalClose = () => setFormModalOpen(false);

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={formModalOpen}
        onClose={handleModalClose}
      >
        <DialogTitle>{"Add Client"}</DialogTitle>
        <DialogContent>
          <ClientFormModal closeModal={handleModalClose}/>
        </DialogContent>
      </Dialog>
      <div style={{ height: "100%", width: "100%" }}>
        {isLoading ? <LinearProgress /> : null}
        <DataGrid
          autoHeight
          rows={data ?? []}
          columns={columns}
          getRowId={(row) => row.clientId}
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
};
