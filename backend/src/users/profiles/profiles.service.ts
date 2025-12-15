import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { ProfileRequest, ProfileUpdate } from './dto/profiles.dto';
import { Account } from 'src/users/accounts/account.entity';
import { ResponseBody } from 'src/common/response/api.response';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(
    account: Account,
    profileRequest: ProfileRequest,
  ): Promise<Profile> {
    const profileData = this.profilesRepository.create({
      ...profileRequest,
      account: { id: account.id },
      updatedAt: new Date(),
    });
    return await this.profilesRepository.save(profileData);
  }

  // TEMPORAL next we will use paginations
  async findAll(): Promise<Profile[]> {
    return await this.profilesRepository.find();
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(ResponseBody.error('Profile was not Found'));
    }
    return profile;
  }

  async findByAccountId(accountId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { account: { id: accountId } },
    });
    if (!profile) {
      throw new NotFoundException(ResponseBody.error('Profile was not Found'));
    }
    return profile;
  }

  async merge(accountId: string, profileUpdate: ProfileUpdate): Promise<void> {
    const profile = await this.profilesRepository.findOneBy({ account: { id: accountId } });
    if (!profile) {
      throw new NotFoundException(ResponseBody.error('Profile was not Found'));
    }
    await this.profilesRepository.save({
      ...profile,
      ...profileUpdate,
      updatedAt: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    await this.profilesRepository.delete({ id });
  }
}
