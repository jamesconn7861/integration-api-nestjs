export class EditOrderDto {
  order_number: string;
  tech: string;
  start_time?: string;
  end_time?: string;
  is_active?: number;
  has_issue?: number;
  note?: string;
}
