import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { Role } from '../users/accounts/enum/role.enum';
import { ProfileRequest } from 'src/users/profiles/dto/profiles.dto';
import { Gender } from 'src/users/profiles/enum/gender.enum';
import { Language } from 'src/users/profiles/enum/language.enum';
import { AccountsService } from 'src/users/accounts/accounts.service';
import { RoutineGoal } from 'src/workout/routines/enum/routine-goal.enum';
import { ProfilesService } from 'src/users/profiles/profiles.service';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly accountService: AccountsService,
    private readonly profilesService: ProfilesService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const user = {
      email: process.env.ADMIN_EMAIL || 'admin.jgraso@email.com',
      password: process.env.ADMIN_PASSWORD || 'administrator123',
    };
    const profile: ProfileRequest = {
      name: 'JGraso',
      birthDate: new Date('1990-01-01'),
      phoneNumber: '0000000000',
      gender: Gender.MALE,
      language: Language.SPANISH,
      fitGoals: [RoutineGoal.GENERAL_FITNESS],
    };

    try {
      const result = await this.accountService.createAdmin(user);
      const account = await this.accountService.findById(result.accountId);
      if (!account) {
        throw new Error('Admin account not found after creation');
      }

      await this.profilesService.create(account.id, profile);
      await this.accountService.markProfileAsComplete(account.id);
    } catch (error) {
      console.error('Error during bootstrap admin creation:', error);
    }
    
  }
}
