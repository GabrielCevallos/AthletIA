import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import {
  ChangePasswordRequest,
  RegisterAccountRequest,
} from 'src/auth/dto/auth.dto';
import { AccountStatus } from './enum/account-status.enum';
import { User, UserItem } from './dto/user-response.dtos';
import { Role } from './enum/role.enum';
import { PaginationRequest } from '../../common/request/pagination.request.dto';
import { PaginationResponse } from 'src/common/interfaces/pagination-response.interface';
import { ResponseBody } from 'src/common/response/api.response';
import { ProfilesService } from 'src/users/profiles/profiles.service';
import { ProfileRequest } from 'src/users/profiles/dto/profiles.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    private readonly profilesService: ProfilesService,
  ) {}

  async createAdmin(user: RegisterAccountRequest): Promise<{ accountId: string; message: string }> {
    const existingAccount = await this.findByEmail(user.email);
    if (existingAccount) {
      throw new BadRequestException('Email already registered');
    }
    const account = this.accountsRepository.create({
      ...user,
      password: await argon2.hash(user.password),
      isEmailVerified: true, // Admins are assumed to have verified email
      role: Role.ADMIN,
      status: AccountStatus.UNPROFILED,
    });
    await this.accountsRepository.save(account);
    return { accountId: account.id, message: 'Account created successfully, please complete profile setup' };
  }

  async create(registerRequest: RegisterAccountRequest): Promise<Account> {
    const account = this.accountsRepository.create({
      ...registerRequest,
      password: await argon2.hash(registerRequest.password),
    });
    await this.accountsRepository.save(account);
    return account;
  }

  async createFromOAuth(params: { email: string; name: string }): Promise<Account> {
    // Create account without password in UNPROFILED state
    const account = this.accountsRepository.create({
      email: params.email,
      password: null!,
    });
    await this.accountsRepository.save(account);
    // Do not create Person yet; force client to complete profile later
    return account;
  }


  async findAll(
    paginationRequest: PaginationRequest,
  ): Promise<PaginationResponse<UserItem>> {
    const { limit = 10, offset = 0 } = paginationRequest;
    const [list, total] = await this.accountsRepository.findAndCount({
      where: { role: Role.USER },
      take: limit,
      skip: offset,
      order: { email: 'DESC' },
      relations: ['profile'],
    });
    return {
      total,
      items: list.map((account) => {
        const { email, id, status, profile } = account;
        return { email, id, status, name: profile?.name };
      }),
      limit,
      offset,
    };
  }

  async completeProfileSetup(
    account: Account,
    profileRequest: ProfileRequest,
  ): Promise<void> {
    const profile = await this.profilesService.create(account, profileRequest);
    account.status = AccountStatus.ACTIVE;
    account.profile = profile;
    await this.accountsRepository.save(account);
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.accountsRepository.findOneBy({ email });
    return account;
  }

  async findUserById(id: string): Promise<User> {
    const account = await this.findById(id);
    if (!account) {
      throw new BadRequestException({
        message: 'Account not found',
        success: false,
      });
    }
    const { email, status, role, profile } = account;
    return {
      email,
      id: account.id,
      status,
      role,
      name: profile?.name || '',
      birthDate: profile?.birthDate || null,
    };
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    return account;
  }

  async findUserForce(id: string): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async suspendAccount(id: string): Promise<{ message: string }> {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    account.status = AccountStatus.SUSPENDED;
    await this.accountsRepository.save(account);
    return { message: 'Account suspended successfully' };
  }

  async giveRole(id: string, role: Role): Promise<{ message: string }> {
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) {
      throw new NotFoundException(ResponseBody.error('Account not found'));
    }
    if (account.role === role) {
      throw new BadRequestException(
        ResponseBody.error(`Account already has role ${role}`),
      );
    }
    if (
      [
        AccountStatus.SUSPENDED,
        AccountStatus.INACTIVE,
        AccountStatus.UNPROFILED,
      ].includes(account.status)
    ) {
      throw new BadRequestException(
        ResponseBody.error(
          `Cannot assign role to account in status ${account.status}`,
        ),
      );
    }
    account.role = role;
    await this.accountsRepository.save(account);
    return { message: `Role ${role} assigned successfully` };
  }

  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) throw new NotFoundException('Account not found');
    account.refreshTokenHash = await argon2.hash(refreshToken);
    await this.accountsRepository.save(account);
  }

  async verifyRefreshToken(id: string, candidate: string): Promise<boolean> {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account || !account.refreshTokenHash) return false;
    return argon2.verify(account.refreshTokenHash, candidate);
  }

  async clearRefreshToken(id: string): Promise<void> {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) return;
    account.refreshTokenHash = null;
    await this.accountsRepository.save(account);
  }

  async changePassword(
    id: string,
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<void> {
    const accountSaved = await this.accountsRepository.findOneBy({ id });
    if (!accountSaved) throw new UnauthorizedException();
    if (!accountSaved.password) throw new UnauthorizedException();
    const ok = await argon2.verify(
      accountSaved.password,
      changePasswordRequest.currentPassword,
    );
    if (!ok) throw new UnauthorizedException();
    accountSaved.password = await argon2.hash(
      changePasswordRequest.newPassword,
    );
    await this.accountsRepository.save(accountSaved);
  }

  async verifyEmail(id: string): Promise<void> {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) throw new BadRequestException('Account not found');
    if (account.isEmailVerified) return; // already verified
    account.isEmailVerified = true;
    await this.accountsRepository.save(account);
  }

  async recordVerificationSend(id: string): Promise<void> {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) throw new BadRequestException('Account not found');
    account.verificationResendCount = (account.verificationResendCount || 0) + 1;
    account.lastVerificationSentAt = new Date();
    await this.accountsRepository.save(account);
  }
}
