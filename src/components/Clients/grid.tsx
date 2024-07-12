import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridFilterModel,
  GridPaginationModel,
  GridToolbarQuickFilter,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useAuth } from "react-oidc-context";
import { useCountGridClients, useGetGridClients } from "../../utils/apiService";
import { Box, Fab, Typography } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ClientFormModal } from "./Form/clientsFormModal";
import { GridModal } from "../modals/gridModal";
import { ClientEditFormModal } from "./Form/clientEditFormModal";
import { Delete, WarningOutlined } from "@mui/icons-material";
import { ClientDeleteModal } from "./Form/clientDeleteModal";
import { GridQueryOptions } from "../../types/gridQueryOptions";

const QuickSearchToolbar = (): JSX.Element => {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter
        debounceMs={200}
        placeholder="Search By Name..."
      />
    </Box>
  );
};

export const ClientsGrid = () => {
  const apiRef = useGridApiRef();
  const user = useAuth();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [gridQueryOptions, setGridQueryOptions] = useState<GridQueryOptions>({
    paging: null,
    searching: null,
  });
  const { isFetching, data, refetch } = useGetGridClients(
    user.user?.access_token,
    gridQueryOptions,
  );
  const { data: gridCount, refetch: refetchCount } = useCountGridClients(
    user.user?.access_token,
  );
  const [gridModal, setGridModal] = useState<JSX.Element | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string | JSX.Element>("");
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
          onClick={() =>
            handleClientDeleteModalOpen(Number.parseInt(params.id.toString()))
          }
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
    setGridModal(
      <ClientFormModal
        closeModal={handleModalClose}
        addClient={refetchData}
      ></ClientFormModal>,
    );
    setIsModalOpen(true);
  };

  const handleClientEditFormModal: GridEventListener<"rowClick"> = (data) => {
    const id = Number.parseInt(data.id.toString());
    setModalTitle("Edit Client");
    setGridModal(
      <ClientEditFormModal
        closeModal={handleModalClose}
        clientId={id}
        updateClient={apiRef.current.updateRows}
      ></ClientEditFormModal>,
    );
    setIsModalOpen(true);
  };

  const handleClientDeleteModalOpen = (id: number) => {
    setModalTitle(
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <WarningOutlined fontSize="large"></WarningOutlined>
      </Box>,
    );
    setGridModal(
      <ClientDeleteModal
        handleModalClose={handleModalClose}
        id={id}
        updateClient={refetchData}
      ></ClientDeleteModal>,
    );
    setIsModalOpen(true);
  };

  const onFilterChange = (model: GridFilterModel) => {
    setGridQueryOptions({ ...gridQueryOptions, searching: model });
  };

  const onPageChange = (model: GridPaginationModel) => {
    setGridQueryOptions({ ...gridQueryOptions, paging: model });
    setPaginationModel(model);
  };

  const refetchData = () => {
    refetchCount();
    refetch();
  };

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
          disableColumnFilter
          autoHeight
          onRowClick={handleClientEditFormModal}
          rows={data ?? []}
          columns={columns}
          getRowId={(row) => row.clientId}
          loading={isFetching}
          rowCount={gridCount ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={onPageChange}
          paginationMode="server"
          slots={{ toolbar: QuickSearchToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          filterMode="server"
          onFilterModelChange={onFilterChange}
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
