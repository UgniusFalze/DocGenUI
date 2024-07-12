import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridDeleteIcon,
  GridEventListener,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
  GridValidRowModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { useAuth } from "react-oidc-context";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { InvoiceFormModal } from "./Form/invoiceFormModal";
import { Box, Checkbox, CircularProgress, Typography } from "@mui/material";
import {
  useCountGridInvoices,
  useGetInvoicesGrid,
  useGetSeriesNumber,
  useSetInvoicePayed,
} from "../../utils/apiService";
import { Download, WarningOutlined } from "@mui/icons-material";
import { HandleDownload } from "../../utils/documentsCrud";
import { useNavigate } from "react-router-dom";
import { GridModal } from "../modals/gridModal";
import { InvoiceDeleteModal } from "./Form/InvoiceDeleteModal";
import { QueryResponse } from "../../types/queryResponse";

export default function InvoiceGrid(props: {
  setResponse: (response: QueryResponse | null) => void;
}) {
  const user = useAuth();
  const navigate = useNavigate();
  const [downloadGridIcon, setDownloadGridIcon] = useState<JSX.Element>(
    <Download></Download>,
  );
  const [gridModal, setGridModal] = useState<JSX.Element | null>(null);
  const [modalTitle, setModalTitle] = useState<string | JSX.Element>("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const { isFetching, data, refetch, error } = useGetInvoicesGrid(
    user.user!.access_token,
    paginationModel.page,
  );

  const { data: invoicesCount, refect: refectCount } = useCountGridInvoices(
    user.user!.access_token,
  );

  useEffect(() => {
    if (error) {
      props.setResponse({
        success: false,
        error: "Failed to retrieve invoices",
      });
    }
  }, [error]);

  const RenderCheckbox = (
    props: GridRenderCellParams<GridValidRowModel, boolean>,
  ) => {
    const [checked, setChecked] = useState(props.value);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      mutate(event.target.checked);
    };

    const { mutate } = useSetInvoicePayed(
      user.user?.access_token,
      Number.parseInt(props.id.toString()),
    );

    return <Checkbox size="medium" onChange={handleChange} checked={checked} />;
  };

  const onClick = (id: GridRowId) => {
    HandleDownload(
      Number.parseInt(id.toString()),
      user.user!.access_token,
    ).then(() => {
      setDownloadGridIcon(<Download></Download>);
    });
    setDownloadGridIcon(<CircularProgress size={20} />);
  };
  const columns: GridColDef[] = [
    { field: "invoiceId", headerName: "ID", width: 70 },
    { field: "clientName", headerName: "Client Name", flex: 0.5 },
    {
      field: "invoiceDate",
      headerName: "Date",
      type: "date",
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "totalSum",
      headerName:
        "Total " +
        (data?.invoicesTotal ?? 0).toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        }),
      type: "number",
      valueFormatter: (value: GridValueFormatterParams<number | null>) => {
        if (value.value === null) {
          return "";
        }
        return value.value.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        });
      },
      flex: 0.5,
    },
    {
      field: "isPayed",
      headerName: "Is Payed?",
      type: "actions",
      renderCell: RenderCheckbox,
    },
    {
      field: "downloadActions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={downloadGridIcon}
          label="DownloadItem"
          onClick={() => onClick(params.id)}
        />,
        <GridActionsCellItem
          icon={<GridDeleteIcon />}
          label="Delete Invoice"
          onClick={() => handleClientDeleteModalOpen(params.id)}
        />,
      ],
    },
  ];

  const seriesNumber = useGetSeriesNumber(user.user!.access_token);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleModalClose = () => setModalOpen(false);
  const handleInvoiceView: GridEventListener<"rowClick"> = (data) => {
    navigate("/invoices/" + data.id);
  };

  const handleFormModalOpen = () => {
    setModalTitle("Add Invoice");
    setGridModal(
      <InvoiceFormModal
        invoiceFormNumber={seriesNumber.data}
        closeModal={handleModalClose}
      />,
    );
    setModalOpen(true);
  };

  const handleContentClose = () => {
    setGridModal(null);
  };

  const handleClientDeleteModalOpen = (id: GridRowId) => {
    const parsedId = Number.parseInt(id.toString());
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
      <InvoiceDeleteModal
        handleModalClose={handleModalClose}
        id={parsedId}
        updateInvoices={refetchData}
      ></InvoiceDeleteModal>,
    );
    setModalOpen(true);
  };

  const refetchData = () => {
    refetch();
    refectCount();
  };

  return (
    <div>
      <GridModal
        isModalOpen={modalOpen}
        handleModalClose={handleModalClose}
        handleContentClose={handleContentClose}
        title={modalTitle}
        modalContent={gridModal}
      ></GridModal>
      <div style={{ height: "100%", width: "100%" }}>
        <Typography gutterBottom variant="h3">
          Invoices
        </Typography>
        <DataGrid
          pagination
          loading={isFetching}
          disableRowSelectionOnClick
          onRowClick={handleInvoiceView}
          autoHeight
          rows={data?.invoices ?? []}
          columns={columns}
          getRowId={(row) => row.invoiceId}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          rowCount={invoicesCount ?? 0}
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
}
