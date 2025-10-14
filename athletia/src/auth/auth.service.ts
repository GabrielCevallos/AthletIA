import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  TokenResponse,
} from './dto/auth.dto';
import * as argon2 from 'argon2';
import { jwtConstants, messages } from './constants';
import { JwtService } from '@nestjs/jwt';
import { ProfileRequest } from 'src/persons/dto/persons.dto';
import { AccountStatus } from 'src/accounts/enum/account-status.enum';
import { Account } from 'src/accounts/account.entity';
import { UserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private jwtService: JwtService,
  ) {}

  private createJwtPayload(account: Account): UserPayload {
    return {
      sub: account.id,
      email: account.email,
      role: account.role,
    };
  }

  private async createTokenResponse(
    payload: UserPayload,
  ): Promise<TokenResponse> {
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: jwtConstants.refreshExpiration,
      }),
    };
  }

  private isAccountActive(account: Account): boolean {
    return account.status === AccountStatus.ACTIVE;
  }

  handleAccountStates(account: Account): void {
    switch (account.status) {
      case AccountStatus.UNPROFILED:
        throw new BadRequestException({
          message: messages.unprofiledAccount,
          accountId: account.id,
        });
      case AccountStatus.INACTIVE:
        throw new UnauthorizedException(messages.inactiveAccount);
      case AccountStatus.SUSPENDED:
        throw new UnauthorizedException(messages.suspendedAccount);
    }
  }

  async registerAccount(
    registerRequest: RegisterAccountRequest,
  ): Promise<{ message: string; accountId: string }> {
    const savedAccount = await this.accountsService.findByEmail(
      registerRequest.email,
    );
    if (savedAccount) {
      this.handleAccountStates(savedAccount);
      throw new BadRequestException({
        message: messages.activeAccount,
        accountId: savedAccount.id,
      });
    }

    const account = await this.accountsService.create(registerRequest);
    return {
      message: messages.accountSaved,
      accountId: account.id,
    };
  }

  async completeWithProfileSetup(
    accountId: string,
    profileRequest: ProfileRequest,
  ): Promise<{ message: string }> {
    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new BadRequestException(messages.invalidAccountId);
    }
    if (
      [AccountStatus.INACTIVE, AccountStatus.SUSPENDED].includes(account.status)
    ) {
      this.handleAccountStates(account);
    }
    if (account.person) {
      throw new BadRequestException(messages.profileAlreadySetUp);
    }
    if (this.isAccountActive(account)) {
      throw new BadRequestException(messages.accountAlreadySetUp);
    }
    await this.accountsService.completeProfileSetup(account, profileRequest);
    return { message: messages.profileSetupCompleted };
  }

  async changePassword(
    accountId: string,
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<{ message: string }> {
    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new BadRequestException(messages.invalidAccountId);
    }
    if (
      [AccountStatus.INACTIVE, AccountStatus.SUSPENDED].includes(account.status)
    ) {
      this.handleAccountStates(account);
    }
    await this.accountsService.changePassword(accountId, changePasswordRequest);
    return { message: messages.passwordChanged };
  }

  async signIn(
    loginRequest: LoginRequest,
  ): Promise<TokenResponse | { message: string; accountId: string }> {
    try {
      const account = await this.accountsService.findByEmail(
        loginRequest.email,
      );
      if (!account) {
        throw new UnauthorizedException();
      }

      if (!this.isAccountActive(account)) {
        this.handleAccountStates(account);
      }

      const ok = await argon2.verify(account.password, loginRequest.password);
      if (!ok) {
        throw new UnauthorizedException();
      }
      const payload = this.createJwtPayload(account);

      return this.createTokenResponse(payload);
    } catch {
      throw new UnauthorizedException(messages.invalidCredentials);
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    let accountId: string;
    try {
      const payload =
        await this.jwtService.verifyAsync<UserPayload>(refreshToken);
      accountId = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }

    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new UnauthorizedException();
    }
    if (!this.isAccountActive(account)) {
      this.handleAccountStates(account);
    }
    const payload = this.createJwtPayload(account);
    return this.createTokenResponse(payload);
  }
}
