import {
  Body,
  Controller,
  ForbiddenException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ProfileUpdate } from './dto/profiles.dto';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AccountsService } from 'src/users/accounts/accounts.service';
import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { ApiResponse } from 'src/common/response/api.response';

@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
    private accountsService: AccountsService,
  ) {}

  @Patch()
  @ApiBody({ type: ProfileUpdate })
  async updateProfile(
    @Req() req: Request & { user: UserPayload },
    @Body() profileUpdate: ProfileUpdate,
    ): Promise<ApiResponse<undefined>> {
    const accountId = req.user.sub;
    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new ForbiddenException();
    }

    await this.profilesService.merge(accountId, profileUpdate);
    const message = 'Profile updated successfully';
    return ApiResponse.success(undefined, message);
  }
}
