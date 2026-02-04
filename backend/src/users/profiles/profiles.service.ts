import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { ProfileRequest, ProfileUpdate } from './dto/profiles.dto';
import { Account } from 'src/users/accounts/account.entity';
import { ResponseBody } from 'src/common/response/api.response';
import { Profile as ProfileResponse } from './dto/profiles.dto';
import { MeasurementsService } from 'src/measurements/measurements.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    private measurementsService: MeasurementsService,
  ) {}

  async create(
    accountId: string,
    profileRequest: ProfileRequest,
  ): Promise<ProfileResponse> {
    const existingProfile = await this.profilesRepository.findOneBy({
      account: { id: accountId },
    });
    if (existingProfile) {
      throw new Error('Profile already exists for this account');
    }

    const profileData = this.profilesRepository.create({
      ...profileRequest,
      account: { id: accountId },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const profileCreated = await this.profilesRepository.save(profileData);
    const { name, birthDate, phoneNumber, gender, fitGoals, account, currentStreak, maxStreak, language } = profileCreated;

    return {
      name,
      birthDate,
      phoneNumber,
      gender,
      fitGoals,
      language,
      email: account.email,
      createdAt: profileCreated.createdAt,
      updatedAt: profileCreated.updatedAt,
      age: await this.calculateAge(birthDate),
      currentStreak,
      maxStreak,
    };
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

  async calculateAge(birthDate: Date): Promise<number> {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  private validateAge(birthDate: Date): void {
    const age = this.calculateAgeSync(birthDate);
    if (age < 18) {
      throw new BadRequestException('User must be at least 18 years old');
    }
  }

  private calculateAgeSync(birthDate: Date): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  private validatePhoneNumber(phoneNumber: string): void {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10 || !/^\d{10}$/.test(cleaned)) {
      throw new BadRequestException('Phone number must be exactly 10 digits');
    }
  }

  async findByAccountId(accountId: string): Promise<ProfileResponse> {
    const profile = await this.profilesRepository.findOne({
      where: { account: { id: accountId } },
      relations: ['account'],
    });
    if (!profile) {
      throw new NotFoundException(ResponseBody.error('Profile was not Found'));
    }
    const { 
      name, birthDate, phoneNumber, gender, fitGoals, updatedAt, account, createdAt, currentStreak, maxStreak, language
     } = profile;

    const measurement = await this.measurementsService.findByAccountId(accountId);

    return { 
      name,
      birthDate,
      phoneNumber,
      gender,
      fitGoals,
      language,
      createdAt,
      updatedAt,
      email: account.email,
      age: await this.calculateAge(birthDate),
      currentStreak,
      maxStreak,
      lastWeight: measurement ? Number(measurement.weight) : undefined,
    };
  }

  async merge(accountId: string, profileUpdate: ProfileUpdate): Promise<void> {
    const profile = await this.profilesRepository.findOneBy({
      account: { id: accountId },
    });
    if (!profile) {
      throw new NotFoundException(ResponseBody.error('Profile was not Found'));
    }

    // Validate individual fields if provided
    if (profileUpdate.birthDate) {
      this.validateAge(profileUpdate.birthDate);
    }

    if (profileUpdate.phoneNumber) {
      this.validatePhoneNumber(profileUpdate.phoneNumber);
    }

    if (profileUpdate.name !== undefined && profileUpdate.name.trim().length === 0) {
      throw new BadRequestException('Name cannot be empty or only whitespace');
    }

    await this.profilesRepository.save({
      ...profile,
      ...profileUpdate,
      updatedAt: new Date(),
    });
  }

  async updateStreak(profileId: string) {
    const profile = await this.profilesRepository.findOne({ where: { id: profileId } });
    if (!profile) return;
    
    const now = new Date();
    const lastActivity = profile.lastActivityDate;

    // Si nunca ha habido actividad, inicializamos
    if (!lastActivity) {
      profile.currentStreak = 1;
      profile.maxStreak = 1;
      profile.lastActivityDate = now;
      await this.profilesRepository.save(profile);
      return;
    }

    // Comparamos fechas
    const isSameDay = this.isSameDay(now, lastActivity);
    const isYesterday = this.isYesterday(now, lastActivity);

    if (isSameDay) {
      // Ya contó hoy
      return;
    }

    if (isYesterday) {
      profile.currentStreak += 1;
      if (profile.currentStreak > profile.maxStreak) {
        profile.maxStreak = profile.currentStreak;
      }
    } else {
      profile.currentStreak = 1;
    }

    profile.lastActivityDate = now;
    await this.profilesRepository.save(profile);
  }

  async updateStreakByAccountId(accountId: string) {
    const profile = await this.profilesRepository.findOne({ where: { account: { id: accountId } } });
    if (profile) {
      await this.updateStreak(profile.id);
    }
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
  }

  private isYesterday(now: Date, past: Date): boolean {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return this.isSameDay(yesterday, past);
  }

  async remove(id: string): Promise<void> {
    await this.profilesRepository.delete({ id });
  }
}
