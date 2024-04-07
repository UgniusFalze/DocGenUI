import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useAuth } from "react-oidc-context";
import { getGridClients } from "../../utils/apiService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ClientFormModal } from "./Form/clientsFormModal";
import { GridModal } from "../modals/gridModal";
import { ClientEditFormModal } from "./Form/clientEditFormModal";

export const ClientsGrid = () => {
  const user = useAuth();
  const { isLoading, data } = getGridClients(user.user?.access_token);
  const [gridModal, setGridModal] = useState<JSX.Element | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const columns: GridColDef[] = [
    { field: "clientId", headerName: "ID", width: 70 },
    { field: "buyerName", headerName: "Client's Name", flex: 0.5 },
    { field: "buyerAddress", headerName: "Client's Address", flex: 1 },
    { field: "buyerCode", headerName: "Client's registration code", flex: 1 },
  ];
  const handleModalClose = () => {
    setGridModal(null);
  };

  const handleFormModalOpen = () => {
    setModalTitle("Add Client");
    setGridModal(<ClientFormModal closeModal={handleModalClose}></ClientFormModal>)
  };

  const handleClientEditFormModal :GridEventListener<"rowClick"> = (data) => {
    const id = Number.parseInt(data.id.toString());
    setModalTitle("Edit Client");
    setGridModal(<ClientEditFormModal closeModal={handleModalClose} clientId={id}></ClientEditFormModal>)
  };

  return (
    <div>
      <GridModal
        isModalOpen={gridModal !== null}
        handleModalClose={handleModalClose}
        title={modalTitle}
        modalContent={gridModal}
      ></GridModal>
      <div style={{ height: "100%", width: "100%" }}>
        <Typography gutterBottom variant="h3">
          Clients
        </Typography>
        {isLoading ? <LinearProgress /> : null}
        <DataGrid
          disableRowSelectionOnClick
          autoHeight
          onRowClick={handleClientEditFormModal}
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
        onClick={() => handleFormModalOpen()}
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
