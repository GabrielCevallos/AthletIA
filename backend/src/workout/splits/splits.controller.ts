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

@Controller('workout/splits')
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateSplit()
  async create(
    @Body() createSplitDto: SplitRequest,
  ): Promise<ResponseBody<Split>> {
    const data = await this.splitsService.create(createSplitDto);
    return new ResponseBody(true, 'Split created successfully', data);
  }

  @Get()
  @ApiListSplits()
  async findAll(): Promise<ResponseBody<Split[]>> {
    const data = await this.splitsService.findAll();
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
  @ApiUpdateSplit()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSplitDto: SplitUpdate,
  ): Promise<ResponseBody<Split>> {
    const data = await this.splitsService.update(id, updateSplitDto);
    return new ResponseBody(true, 'Split updated successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteSplit()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseBody<null>> {
    await this.splitsService.remove(id);
    return new ResponseBody(true, 'Split deleted successfully');
  }
}
