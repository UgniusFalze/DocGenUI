import { GridFilterModel, GridPaginationModel } from "@mui/x-data-grid";

export type GridQueryOptions = {
  paging: GridPaginationModel | null;
  searching: GridFilterModel | null;
};
