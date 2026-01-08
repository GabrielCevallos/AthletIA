import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SplitsService } from './splits.service';
import { SplitRequest, SplitUpdate } from './dto/splits.dto';
import { ResponseBody } from '../../common/response/api.response';
import { Split } from './splits.entity';
import {
  ApiCreateSplit,
  ApiListSplits,
  ApiGetSplit,
  ApiUpdateSplit,
  ApiDeleteSplit,
} from './swagger.decorators';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { OwnershipGuard } from '../../auth/guards/ownership.guard';
import { Request } from 'express';
import { Role } from 'src/users/accounts/enum/role.enum';
import { PaginationRequest } from '../../common/request/pagination.request.dto';
import { PaginationResponse } from '../../common/interfaces/pagination-response.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Splits')
@Controller('workout/splits')
@UseGuards(AuthGuard)
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateSplit()
  async create(
    @Body() createSplitDto: SplitRequest,
    @Req() req: Request & { user?: any },
  ): Promise<ResponseBody<Split>> {
    const data = await this.splitsService.create(createSplitDto);
    return new ResponseBody(true, 'Split created successfully', data);
  }

  @Get()
  @ApiListSplits()
  async findAll(
    @Query() pagination: PaginationRequest,
  ): Promise<ResponseBody<PaginationResponse<Split>>> {
    const data = await this.splitsService.findAll(pagination);
    return new ResponseBody(true, 'Splits retrieved successfully', data);
  }

  @Get(':id')
  @ApiGetSplit()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseBody<Split>> {
    const data = await this.splitsService.findOne(id);
    return new ResponseBody(true, 'Split retrieved successfully', data);
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @ApiUpdateSplit()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSplitDto: SplitUpdate,
    @Req() req: Request & { user?: any; resource?: any },
  ): Promise<ResponseBody<Split>> {
    req.resource = await this.splitsService.findOne(id);
    const data = await this.splitsService.update(id, updateSplitDto);
    return new ResponseBody(true, 'Split updated successfully', data);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteSplit()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user?: any; resource?: any },
  ): Promise<ResponseBody<null>> {
    req.resource = await this.splitsService.findOne(id);
    await this.splitsService.remove(id);
    return new ResponseBody(true, 'Split deleted successfully');
  }
}
