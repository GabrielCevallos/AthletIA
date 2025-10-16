import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileUpdate } from './dto/profiles.dto';
import { ProfilesService } from './profiles.service';
import { Profile } from './profile.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AccountsService } from 'src/accounts/accounts.service';
import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { Role } from 'src/accounts/enum/role.enum';

@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
    private accountsService: AccountsService,
  ) {}

  @Get(':id')
  async findProfile(@Param('id') id: string): Promise<Profile> {
    return await this.profilesService.findById(id);
  }

  @Put(':id')
  async updateProfile(
    @Req() req: Request & { user: UserPayload },
    @Param('id') id: string,
    @Body() profileUpdate: ProfileUpdate,
  ): Promise<void> {
    const account = await this.accountsService.findById(req.user.sub);
    if (!account) {
      throw new ForbiddenException();
    }
    if (account.profile.id !== id && account.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    await this.profilesService.merge(id, profileUpdate);
  }
}
