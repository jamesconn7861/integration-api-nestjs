export class ChangeParams {
  user: string;
  benchId: number;
  vlanId: number;
  reqRange: [number, number];
  switchRange: [number, number];
  lockedPorts?: number[];
  skipedPorts?: number[];
  rangeString: string;
}
