export interface GridConfigColumns {
  hiddenColumns: string[];
  expandedColumns: string[];
  addedColumns: string[];
}

export interface GridReferenceDefinition {
  schemaName: string;
  pureName: string;
  columns: {
    baseName: string;
    refName: string;
  }[];
}

export type GroupFunc = 'GROUP' | 'MAX' | 'MIN' | 'SUM' | 'AVG' | 'COUNT' | 'COUNT DISTINCT' | 'NULL';

export interface GridConfig extends GridConfigColumns {
  filters: { [uniqueName: string]: string };
  focusedColumns?: string[];
  columnWidths: { [uniqueName: string]: number };
  sort: {
    uniqueName: string;
    order: 'ASC' | 'DESC';
  }[];
  grouping: { [uniqueName: string]: GroupFunc };
  childConfig?: GridConfig;
  reference?: GridReferenceDefinition;
  isFormView?: boolean;
  formViewKey?: { [uniqueName: string]: string };
  formViewKeyRequested?: { [uniqueName: string]: string };
  formFilterColumns: string[];
  formColumnFilterText?: string;
}

export interface GridCache {
  refreshTime: number;
}

export function createGridConfig(): GridConfig {
  return {
    hiddenColumns: [],
    expandedColumns: [],
    addedColumns: [],
    filters: {},
    columnWidths: {},
    sort: [],
    grouping: {},
    formFilterColumns: [],
  };
}

export function createGridCache(): GridCache {
  return {
    refreshTime: new Date().getTime(),
  };
}
