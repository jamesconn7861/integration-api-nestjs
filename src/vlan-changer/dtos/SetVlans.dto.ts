export class SetVlansDto {
  user: string;
  ports: [number, number];
  vlan: string | number;
  benchId: string | number;
}
