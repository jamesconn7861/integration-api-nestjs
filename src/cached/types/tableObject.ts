// TODO Add class-validation decorators.

export interface TableObject {
  id: string;
  displayName?: string;
  notes?: string;
  filePaths?: string[];
  columns: TableProperites[];
}

// TODO Add class-validation decorators and move to independant file.
export interface TableProperites {
  id: string;
  displayName?: string;
  dataType: string;
  source?: string[];
  nullable?: boolean;
  defaultValue?: any;
  hidden?: boolean;
}
