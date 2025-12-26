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
import { RoutinesService } from './routines.service';
import { RoutineRequest, RoutineUpdate } from './dto/routines.dto';
import { ResponseBody } from '../../common/response/api.response';
import { Routine } from './routines.entity';
import {
  ApiCreateRoutine,
  ApiListRoutines,
  ApiGetRoutine,
  ApiUpdateRoutine,
  ApiDeleteRoutine,
} from './swagger.decorators';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { OwnershipGuard } from '../../auth/guards/ownership.guard';
import { Request } from 'express';
import { Role } from 'src/users/accounts/enum/role.enum';
import { PaginationRequest } from '../../common/request/pagination.request.dto';
import { PaginationResponse } from '../../common/interfaces/pagination-response.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Routines')
@Controller('workout/routines')
@UseGuards(AuthGuard)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateRoutine()
  async create(
    @Body() createRoutineDto: RoutineRequest,
    @Req() req: Request & { user?: any },
  ): Promise<ResponseBody<Routine>> {
    const userId = req.user.id;
    const isAdmin = req.user.role === Role.ADMIN;
    const data = await this.routinesService.create(
      createRoutineDto,
      userId,
      isAdmin,
    );
    return new ResponseBody(true, 'Routine created successfully', data);
  }

  @Get()
  @ApiListRoutines()
  async findAll(
    @Query() pagination: PaginationRequest,
  ): Promise<ResponseBody<PaginationResponse<Routine>>> {
    const data = await this.routinesService.findAll(pagination);
    return new ResponseBody(true, 'Routines retrieved successfully', data);
  }

  @Get(':id')
  @ApiGetRoutine()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseBody<Routine>> {
    const data = await this.routinesService.findOne(id);
    return new ResponseBody(true, 'Routine retrieved successfully', data);
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @ApiUpdateRoutine()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoutineDto: RoutineUpdate,
    @Req() req: Request & { user?: any; resource?: any },
  ): Promise<ResponseBody<Routine>> {
    req.resource = await this.routinesService.findOne(id);
    const data = await this.routinesService.update(id, updateRoutineDto);
    return new ResponseBody(true, 'Routine updated successfully', data);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteRoutine()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user?: any; resource?: any },
  ): Promise<ResponseBody<null>> {
    req.resource = await this.routinesService.findOne(id);
    await this.routinesService.remove(id);
    return new ResponseBody(true, 'Routine deleted successfully');
  }
}
