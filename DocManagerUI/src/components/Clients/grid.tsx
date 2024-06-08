import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridPaginationModel, useGridApiRef } from "@mui/x-data-grid";
import { useAuth } from "react-oidc-context";
import { useCountGridClients, useGetGridClients } from "../../utils/apiService";
import {
  Box,
  Fab,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ClientFormModal } from "./Form/clientsFormModal";
import { GridModal } from "../modals/gridModal";
import { ClientEditFormModal } from "./Form/clientEditFormModal";
import { Delete, WarningOutlined} from "@mui/icons-material";
import { ClientDeleteModal } from "./Form/clientDeleteModal";

export const ClientsGrid = () => {
  const apiRef = useGridApiRef();
  const user = useAuth();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const { isFetching, data, refetch } = useGetGridClients(user.user?.access_token, paginationModel.page);
  const { data: gridCount, refetch: refetchCount} = useCountGridClients(user.user?.access_token);
  const [gridModal, setGridModal] = useState<JSX.Element | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string|JSX.Element>("");
  const columns: GridColDef[] = [
    { field: "clientId", headerName: "ID", width: 70 },
    { field: "buyerName", headerName: "Client's Name", flex: 0.5 },
    { field: "buyerAddress", headerName: "Client's Address", flex: 1 },
    { field: "buyerCode", headerName: "Client's registration code", flex: 1 },
    {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          label="DeleteItem"
          onClick={() => handleClientDeleteModalOpen(params.id)}
        />,
      ],
    },
  ];
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleContentClose = () => {
    setGridModal(null);
  };

  const handleFormModalOpen = () => {
    setModalTitle("Add Client");
    setGridModal(<ClientFormModal closeModal={handleModalClose} addClient={refetchData}></ClientFormModal>);
    setIsModalOpen(true);
  };

  const handleClientEditFormModal :GridEventListener<"rowClick"> = (data) => {
    const id = Number.parseInt(data.id.toString());
    setModalTitle("Edit Client");
    setGridModal(<ClientEditFormModal  closeModal={handleModalClose} clientId={id} updateClient={apiRef.current.updateRows}></ClientEditFormModal>);
    setIsModalOpen(true);
  };

  const handleClientDeleteModalOpen = (id: any) => {
    const clientId = Number.parseInt(id.toString());
    setModalTitle(<Box width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}><WarningOutlined fontSize="large"></WarningOutlined></Box>);
    setGridModal(<ClientDeleteModal handleModalClose={handleModalClose} id={clientId} updateClient={refetchData}></ClientDeleteModal>);
    setIsModalOpen(true);
  }

  const refetchData = () => {
    refetchCount();
    refetch();
  }


  return (
    <div>
      <GridModal
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
        handleContentClose={handleContentClose}
        title={modalTitle}
        modalContent={gridModal}
      ></GridModal>
      <div style={{ height: "100%", width: "100%" }}>
        <Typography gutterBottom variant="h3">
          Clients
        </Typography>
        <DataGrid
          apiRef={apiRef} 
          disableRowSelectionOnClick
          autoHeight
          onRowClick={handleClientEditFormModal}
          rows={data ?? []}
          columns={columns}
          getRowId={(row) => row.clientId}
          loading={isFetching}
          rowCount={gridCount ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"

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
