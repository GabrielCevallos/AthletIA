import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  RequestMapping,
  UseGuards,
} from '@nestjs/common';
import { Profile, ProfileRequest, ProfileUpdate } from './dto/profiles.dto';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AccountsService } from 'src/users/accounts/accounts.service';
import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { ResponseBody } from 'src/common/response/api.response';
import { ApiUpdateProfile } from './swagger.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
import { Role } from '../accounts/enum/role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
    private accountsService: AccountsService,
  ) {}

  @Patch()
  @Roles(Role.USER, Role.ADMIN, Role.MODERATOR)
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

  @Roles(Role.USER, Role.ADMIN, Role.MODERATOR)
  @Post('complete-setup')
  async completeProfileSetup(
    @Req() req: Request & { user: UserPayload },
    @Body() profileData: ProfileRequest,
  ): Promise<ResponseBody<Profile>> {
    const accountId = req.user.sub;
    const profileCreated = await this.profilesService.create(accountId, profileData);
    await this.accountsService.markProfileAsComplete(accountId);
    const message = 'Profile created successfully';
    return ResponseBody.success(profileCreated, message);
  }

  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get('by-account/:accountId')
  async getProfileByAccountId(
    @Param('accountId') accountId: string,
  ): Promise<ResponseBody<Profile>> {
    const profile = await this.profilesService.findByAccountId(accountId);
    const message = 'Profile fetched successfully';
    return ResponseBody.success(profile, message);
  }

  @Get('me')
  @Roles(Role.USER, Role.ADMIN, Role.MODERATOR)
  async findMyProfile(
    @Req() req: Request & { user: UserPayload },
  ): Promise<ResponseBody<Profile>> {
    const accountId = req.user.sub;
    const profile = await this.profilesService.findByAccountId(accountId);
    const message = 'Profile fetched successfully';
    return ResponseBody.success(profile, message);
  }
}
