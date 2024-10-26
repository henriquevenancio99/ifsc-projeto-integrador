export interface ITableRow {
  key: string;
  cells: React.ReactElement[] | string[];
  actions: React.ReactElement;
}

export interface ITablePagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ITableContent {
  headers: string[];
  rows: ITableRow[];
  renderActionColumn: boolean;
  pagination: ITablePagination;
}
