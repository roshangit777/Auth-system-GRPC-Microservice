import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ImageBuyDtos {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: "User id much be included" })
  userId: number;

  @IsNotEmpty({ message: "Image id much be included" })
  @IsString()
  imageId: string;

  @IsNotEmpty({ message: "Purchase Method be defined" })
  @IsString()
  puchaseMethod: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: "Price must be defined" })
  price: number;
}
