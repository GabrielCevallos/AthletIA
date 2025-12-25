import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
import { PaginationRequest } from '../../common/request/pagination.request.dto';
import { Role } from './enum/role.enum';
import { ResponseBody } from 'src/common/response/api.response';
import { PaginationResponse } from 'src/common/interfaces/pagination-response.interface';
import { User, UserItem } from './dto/user-response.dtos';
import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import {
  ApiFindAllUsers,
  ApiFindUserById,
  ApiSuspendUser,
  ApiGiveRole,
} from './swagger.decorators';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get()
  @ApiFindAllUsers()
  async findAll(
    @Query() paginationRequest: PaginationRequest,
  ): Promise<ResponseBody<void> & PaginationResponse<UserItem>> {
    const pagination = await this.accountsService.findAll(paginationRequest);
    const success = true;
    const message = 'User list fetched successfully';
    return { ...pagination, success, message };
  }

  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get(':id')
  @ApiFindUserById()
  async findOne(@Param('id') id: string): Promise<ResponseBody<User>> {
    const user = await this.accountsService.findUser(id);
    const message = 'User fetched successfully';
    return ResponseBody.success(user, message);
  }

  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':id/suspend')
  @ApiSuspendUser()
  async suspendAccount(@Param('id') id: string): Promise<ResponseBody<void>> {
    const result = await this.accountsService.suspendAccount(id);
    return ResponseBody.success(undefined, result.message);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/give-role')
  @ApiGiveRole()
  async giveRole(
    @Req() request: Request & { user: UserPayload },
    @Param('id') id: string,
    @Body('role') role: Role,
  ): Promise<ResponseBody<void>> {
    const user = request.user;
    if (user.sub === id) {
      throw new BadRequestException(
        ResponseBody.error('You cannot change your own role'),
      );
    }
    const result = await this.accountsService.giveRole(id, role);
    return ResponseBody.success(undefined, result.message);
  }
}
