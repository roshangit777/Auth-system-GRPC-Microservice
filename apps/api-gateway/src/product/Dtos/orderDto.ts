import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";

export class OrderDto {
  @Type(() => Number)
  @IsNumber()
  amount: number; // in smallest currency unit, e.g., 50000 = ₹500

  @IsString()
  currency: string; // e.g., "INR"

  @Type(() => Number)
  @IsNumber()
  userId: number;

  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  number?: string;
}
