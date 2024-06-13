import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowId,
  GridValidRowModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { GetGrid } from "../../utils/invoiceGrid";
import { useAuth } from "react-oidc-context";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { InvoiceFormModal } from "./Form/invoiceFormModal";
import {
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetSeriesNumber, useSetInvoicePayed } from "../../utils/apiService";
import { Download } from "@mui/icons-material";
import { HandleDownload } from "../../utils/documentsCrud";
import { useNavigate } from "react-router-dom";
import { GridModal } from "../modals/gridModal";

export default function InvoiceGrid() {
  const user = useAuth();
  const navigate = useNavigate();
  const [downloadGridIcon, setDownloadGridIcon] = useState<JSX.Element>(<Download></Download>);
  const { isFetching, data} = useQuery({
    queryKey: ["invoicesGrid", user.user?.access_token],
    queryFn: () => GetGrid(user.user!.access_token),
  });

  const RenderCheckbox = (props: GridRenderCellParams<GridValidRowModel,boolean>) => {
    const [checked, setChecked] = useState(props.value);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      mutate(event.target.checked);
    }

    const {mutate} = useSetInvoicePayed(user.user?.access_token, Number.parseInt(props.id.toString()));

    return (
      <Checkbox
        size="medium"
        onChange={handleChange}
        checked={checked}
      />
    )
  }

  const onClick = (id: GridRowId) => {
    HandleDownload(Number.parseInt(id.toString()), user.user!.access_token)
      .then(() => {
        setDownloadGridIcon(<Download></Download>)
      });
      setDownloadGridIcon(<CircularProgress size={20} />)
  };
  const columns: GridColDef[] = [
    { field: "invoiceId", headerName: "ID", width: 70 },
    { field: "clientName", headerName: "Client Name", flex: 0.5 },
    {
      field: "invoiceDate",
      headerName: "Date",
      type: "date",
      valueGetter: ({ value }) => value && new Date(value)
    },
    {field:"totalSum", headerName:"Total " + ((data?.invoicesTotal) ?? 0).toLocaleString("de-DE", { style: "currency", currency: "EUR" }), type: "number", valueFormatter: (value: GridValueFormatterParams<number|null>) => {
      if(value.value === null){
        return '';
      }
      return value.value.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
    },
    flex: 0.5
  },
    {
      field: "isPayed",
      headerName: "Is Payed?",
      type:"actions",
      renderCell: RenderCheckbox
    },
    {
      field: "downloadActions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={downloadGridIcon}
          label="DownloadItem"
          onClick={() => onClick(params.id)}
        />
      ],
    },
  ];

  const seriesNumber = useGetSeriesNumber(user.user!.access_token);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleInvoiceView: GridEventListener<"rowClick"> = (data) => {
    navigate("/invoices/" + data.id);
  };

  const handleContentClose = () => {
    return;
  };

  return (
    <div>
      <GridModal
        isModalOpen={modalOpen}
        handleModalClose={handleModalClose}
        handleContentClose={handleContentClose}
        title="Add Invoice"
        modalContent={
          <InvoiceFormModal
            invoiceFormNumber={seriesNumber.data}
            closeModal={handleModalClose}
          />
        }
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
