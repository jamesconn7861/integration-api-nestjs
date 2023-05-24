// TODO add class-validation decorators & default values for missing values

export class ChangeParams {
  user: string;
  benchId: number;
  vlanId: number;
  reqRange: [number, number];
  switchRange: [number, number];
  lockedPorts?: number[];
  skippedPorts?: number[];
  rangeString: string;
}
