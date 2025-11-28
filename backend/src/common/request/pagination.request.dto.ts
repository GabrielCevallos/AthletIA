import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationRequest {
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @Min(0)
  offset: number;
}
