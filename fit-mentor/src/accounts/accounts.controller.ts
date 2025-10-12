import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
import { UserRegisterRequest } from './dto/user-register-request.dto';
import { PaginationRequest } from './dto/pagination-request.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Roles('admin')
  @Post('create-user')
  async create(@Body() registerRequest: UserRegisterRequest) {
    const { email, password } = registerRequest;
    const { name, birthDate, gender, phoneNumber } = registerRequest;
    await this.accountsService.save(
      { email, password },
      { name, birthDate, gender, phoneNumber },
    );
    return {
      success: true,
      message: 'User created successfully',
    };
  }

  @Roles('admin')
  @Get()
  async findAll(@Query() paginationRequest: PaginationRequest) {
    const pagination = await this.accountsService.findAll(paginationRequest);
    return {
      ...pagination,
      success: true,
      message: 'User list fetched successfully',
    };
  }

  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      data: this.accountsService.findById(id),
      success: true,
      message: 'User fetched successfully',
    };
  }

  @Roles('admin')
  @Put(':id/suspend')
  async suspendAccount(@Param('id') id: string) {
    return {
      ...(await this.accountsService.suspendAccount(id)),
      success: true,
    };
  }
}
