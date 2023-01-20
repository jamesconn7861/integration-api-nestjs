// TODO Add class-validation decorators.

export interface TableObject {
  id: string;
  displayName?: string;
  notes?: string;
  filePaths?: string[];
  columns: ColumnProperties[];
}

// TODO Add class-validation decorators and move to independant file.
export interface ColumnProperties {
  id: string;
  displayName?: string;
  dataType: string;
  source?: string[];
  nullable?: boolean;
  defaultValue?: any;
  hidden?: boolean;
}
