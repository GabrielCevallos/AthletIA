import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Role } from '../accounts/enum/role.enum';
import { ProfileRequest } from 'src/profiles/dto/profiles.dto';
import { Gender } from 'src/profiles/enum/gender.enum';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(private readonly authService: AuthService) {}

  async onApplicationBootstrap(): Promise<void> {
    const user = {
      email: 'admin.jgraso@email.com',
      password: 'administrator123',
      role: Role.ADMIN,
    };
    const profile: ProfileRequest = {
      name: 'JGraso',
      birthDate: new Date('1990-01-01'),
      phoneNumber: '0000000000',
      gender: Gender.MALE,
    };

    const result = await this.authService.registerAccount(user);
    if ('accountId' in result) {
      await this.authService.completeWithProfileSetup(
        result.accountId,
        profile,
      );
    }
  }
}
