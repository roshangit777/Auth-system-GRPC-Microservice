import { PaginationQueryDto } from "apps/common/dto/pagination-query.dto";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class FindPostsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: "Title must be a string" })
  @MaxLength(100, { message: "Title search can not exceed 100 charecters" })
  title?: string;
}
