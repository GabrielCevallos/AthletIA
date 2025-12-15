import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationRequest {
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Results per page limit', example: 10 })
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @Min(0)
  @ApiPropertyOptional({ description: 'Result offset', example: 0 })
  offset: number;
}
