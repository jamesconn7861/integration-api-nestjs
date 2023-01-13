export class TableObject {
  id: string;
  displayName?: string;
  notes?: string;
  filePaths?: string[];
  columns: TableProperites[];
}

export class TableProperites {
  id: string;
  displayName?: string;
  dataType: string;
  source?: string[];
  nullable?: boolean;
  defaultValue?: any;
  hidden?: boolean;
}
