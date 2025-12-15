import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileUpdate } from './dto/profiles.dto';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AccountsService } from 'src/users/accounts/accounts.service';
import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { Role } from 'src/users/accounts/enum/role.enum';
import { ResponseBody } from 'src/common/response/api.response';
import { ApiUpdateProfile } from './swagger.decorators';

@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
    private accountsService: AccountsService,
  ) {}

  @Patch()
  @ApiUpdateProfile()
  async updateProfile(
    @Req() req: Request & { user: UserPayload },
    @Body() profileUpdate: ProfileUpdate,
    ): Promise<ResponseBody<undefined>> {
    const accountId = req.user.sub;
    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new ForbiddenException();
    }

    await this.profilesService.merge(accountId, profileUpdate);
    const message = 'Profile updated successfully';
    return ResponseBody.success(undefined, message);
  }
}
