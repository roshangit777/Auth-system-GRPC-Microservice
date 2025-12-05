import { IsString, IsNumber, IsNotEmpty, IsObject } from "class-validator";

class CustomerDto {
  @IsString()
  @IsNotEmpty()
  contact: string;
}

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsNotEmpty()
  customer: CustomerDto;

  @IsNotEmpty()
  orderId: string;
}
