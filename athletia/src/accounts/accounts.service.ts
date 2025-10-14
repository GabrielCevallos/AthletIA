import {
  BadRequestException,
  Injectable,
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
import { PersonsService } from 'src/persons/persons.service';
import { AccountStatus } from './enum/account-status.enum';
import { ProfileRequest } from 'src/persons/dto/persons.dto';
import { User, UserItem } from './dto/user-response.dtos';
import { Role } from './enum/role.enum';
import { PaginationRequest } from './dto/pagination-request.dto';
import { PaginationResponse } from 'src/common/interfaces/pagination-response.interface';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    private readonly personsService: PersonsService,
  ) {}

  async create(registerRequest: RegisterAccountRequest): Promise<Account> {
    const account = this.accountsRepository.create({
      ...registerRequest,
      password: await argon2.hash(registerRequest.password),
    });
    await this.accountsRepository.save(account);
    return account;
  }

  async save(
    registerRequest: RegisterAccountRequest,
    profile: ProfileRequest,
  ): Promise<Account> {
    await this.create(registerRequest);
    const account = await this.findByEmail(registerRequest.email);
    if (!account) {
      throw new BadRequestException('Account not found after creation');
    }
    await this.personsService.create(account, profile);
    account.status = AccountStatus.ACTIVE;
    await this.accountsRepository.save(account);
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
      relations: ['person'],
    });
    return {
      total,
      items: list.map((account) => {
        const { email, id, status, person } = account;
        return { email, id, status, name: person?.name };
      }),
      limit,
      offset,
    };
  }

  async completeProfileSetup(
    account: Account,
    profileRequest: ProfileRequest,
  ): Promise<void> {
    const person = await this.personsService.create(account, profileRequest);
    account.status = AccountStatus.ACTIVE;
    account.person = person;
    await this.accountsRepository.save(account);
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.accountsRepository.findOneBy({ email });
    return account;
  }

  async findUserById(id: string): Promise<User | null> {
    const account = await this.findById(id);
    if (!account) {
      throw new BadRequestException({
        message: 'Account not found',
        success: false,
      });
    }
    const { email, status, role, person } = account;
    return {
      email,
      id: account.id,
      status,
      role,
      name: person?.name || '',
      birthDate: person?.birthDate || null,
    };
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['person'],
    });
    return account;
  }

  async suspendAccount(id: string): Promise<{ message: string }> {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) throw new BadRequestException('Account not found');
    account.status = AccountStatus.SUSPENDED;
    await this.accountsRepository.save(account);
    return { message: 'Account suspended successfully' };
  }

  async changePassword(
    id: string,
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<void> {
    const accountSaved = await this.accountsRepository.findOneBy({ id });
    if (!accountSaved) throw new UnauthorizedException();
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
}
