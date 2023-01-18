import { ArrayMinSize, IsAlpha, IsArray, IsNotEmpty } from 'class-validator';

export class DeleteOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  orderIds: [number];

  @IsNotEmpty()
  @IsAlpha()
  tech: string;
}
