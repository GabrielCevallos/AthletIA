import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { Role } from '../users/accounts/enum/role.enum';
import { ProfileRequest } from 'src/users/profiles/dto/profiles.dto';
import { Gender } from 'src/users/profiles/enum/gender.enum';
import { AccountsService } from 'src/users/accounts/accounts.service';
import { RoutineGoal } from 'src/workout/routines/enum/routine-goal.enum';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(private readonly accountService: AccountsService) {}

  async onApplicationBootstrap(): Promise<void> {
    const user = {
      email: 'admin.jgraso@email.com',
      password: 'administrator123',
    };
    const profile: ProfileRequest = {
      name: 'JGraso',
      birthDate: new Date('1990-01-01'),
      phoneNumber: '0000000000',
      gender: Gender.MALE,
      fitGoals: [RoutineGoal.GENERAL_FITNESS],
    };

    const result = await this.accountService.createAdmin(user);
    const account = await this.accountService.findById(result.accountId);
    if (!account) {
      throw new Error('Admin account not found after creation');
    }

    await this.accountService.completeProfileSetup(account, profile);
  }
}
