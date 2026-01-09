import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountsService } from 'src/users/accounts/accounts.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  TokenResponse,
} from './dto/auth.dto';
import * as argon2 from 'argon2';
import { jwtConstants, messages } from './constants';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/mail/mail.service';
import { AccountState } from 'src/users/accounts/enum/account-states.enum';
import { Account } from 'src/users/accounts/account.entity';
import { UserPayload } from './interfaces/user-payload.interface';
import * as dotenv from 'dotenv';
import { ProfileRequest } from 'src/users/profiles/dto/profiles.dto';
import { GoogleUser } from './strategies/google.strategy';
import { User } from 'src/users/accounts/dto/user-response.dtos';

dotenv.config();

@Injectable()
export class AuthService {
  logger: Logger;

  constructor(
    private accountsService: AccountsService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    this.logger = new Logger(AuthService.name);
    this.logger.log('AuthService initialized');
  }

  private createJwtPayload(account: Account): UserPayload {
    return {
      sub: account.id,
      id: account.id,
      email: account.email,
      role: account.role,
    };
  }

  private async createTokenResponse(
    payload: UserPayload,
  ): Promise<TokenResponse> {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: jwtConstants.accessExpiration,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: jwtConstants.refreshExpiration,
        secret: process.env.JWT_SECRET_KEY_REFRESH,
      }),
      accountId: payload.sub,
    };
  }

  private isAccountActive(account: Account): boolean {
    return account.status === AccountState.ACTIVE;
  }

  handleAccountStates(account: Account): void {
    switch (account.status) {
      case AccountState.DEACTIVATED:
        throw new UnauthorizedException(messages.deactivatedAccount);
      case AccountState.SUSPENDED:
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

    // Rate-limit check for initial verification send
    const resendLimit = Number(process.env.VERIFICATION_RESEND_LIMIT || 5);
    const resendWindowMinutes = Number(
      process.env.VERIFICATION_RESEND_WINDOW_MINUTES || 60,
    );
    if (account.verificationResendCount && account.lastVerificationSentAt) {
      const elapsedMs =
        Date.now() - new Date(account.lastVerificationSentAt).getTime();
      if (
        elapsedMs <= resendWindowMinutes * 60 * 1000 &&
        account.verificationResendCount >= resendLimit
      ) {
        throw new BadRequestException(messages.tooManyVerificationRequests);
      }
    }

    // Generate a signed JWT as verification token (short lived) using email-specific secret
    const emailSecret =
      process.env.JWT_SECRET_KEY_EMAIL ||
      process.env.JWT_SECRET_KEY_ACCESS ||
      'defaultEmailSecret';
    const verificationToken = await this.jwtService.signAsync(
      { sub: account.id, email: account.email },
      { expiresIn: '24h', secret: emailSecret },
    );

    // Build verification link (frontend should provide base URL via env)
    const frontendBase =
      process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    const verificationLink = `${frontendBase}/auth/verify-email?token=${verificationToken}`;

    // Send verification email (MailService will log if SMTP not configured)
    await this.mailService.sendVerificationEmail(
      account.email,
      verificationLink,
    );
    // record send metadata
    await this.accountsService.recordVerificationSend(account.id);

    return {
      message: messages.verificationEmailSent,
      accountId: account.id,
    };
  }

  /* async completeWithProfileSetup(
    accountId: string,
    profileRequest: ProfileRequest,
  ): Promise<{ message: string }> {
    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new BadRequestException(messages.invalidAccountId);
    }
    if (!account.isEmailVerified) {
      throw new BadRequestException(messages.emailNotVerified);
    }
    if (account.hasProfile) {
      throw new BadRequestException(messages.profileAlreadySetUp);
    }

    await this.accountsService.completeProfileSetup(account, profileRequest);
    return { message: messages.profileSetupCompleted };
  } */

  async changePassword(
    accountId: string,
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<{ message: string }> {
    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new BadRequestException(messages.invalidAccountId);
    }
    if (
      [AccountState.SUSPENDED, AccountState.DEACTIVATED].includes(account.status)
    ) {
      this.handleAccountStates(account);
    }
    if (!account.isEmailVerified) {
      throw new BadRequestException(messages.emailNotVerified);
    }

    await this.accountsService.changePassword(accountId, changePasswordRequest);
    return { message: messages.passwordChanged };
  }

  async signIn(loginRequest: LoginRequest): Promise<TokenResponse> {
    const account = await this.accountsService.findByEmail(loginRequest.email);
    if (!account) {
      throw new UnauthorizedException(messages.invalidCredentials);
    }

    if (!this.isAccountActive(account)) {
      this.handleAccountStates(account);
    }

    if (!account.password) {
      throw new UnauthorizedException();
    }
    const ok = await argon2.verify(account.password, loginRequest.password);
    if (!ok) {
      throw new UnauthorizedException();
    }
    if (!account.isEmailVerified) {
      throw new BadRequestException(messages.emailNotVerified);
    }
    const payload = this.createJwtPayload(account);

    const tokens = await this.createTokenResponse(payload);
    await this.accountsService.setRefreshToken(account.id, tokens.refreshToken);
    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    let accountId: string;
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(
        refreshToken,
        {
          secret:
            process.env.JWT_SECRET_KEY_REFRESH || 'defaultSecretKeyRefresh',
        },
      );
      accountId = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }

    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new UnauthorizedException();
    }

    // Validate provided refresh token against stored hash
    const valid = await this.accountsService.verifyRefreshToken(
      account.id,
      refreshToken,
    );
    if (!valid) throw new UnauthorizedException();

    if (!this.isAccountActive(account)) {
      this.handleAccountStates(account);
    }

    const payload = this.createJwtPayload(account);
    const tokens = await this.createTokenResponse(payload);
    // Rotate refresh token
    await this.accountsService.setRefreshToken(account.id, tokens.refreshToken);
    return tokens;
  }

  async logout(accountId: string): Promise<{ message: string }> {
    const account = await this.accountsService.findById(accountId);
    if (!account) {
      throw new BadRequestException(messages.invalidAccountId);
    }
    if (
      [AccountState.SUSPENDED, AccountState.DEACTIVATED].includes(account.status)
    ) {
      this.handleAccountStates(account);
    }
    await this.accountsService.clearRefreshToken(accountId);
    return { message: 'Logged out successfully' };
  }

  async signInWithGoogle(googleUser: GoogleUser): Promise<TokenResponse> {
    if (!googleUser.email) {
      throw new UnauthorizedException('Google account has no verified email');
    }
    // Find account by email
    let account = await this.accountsService.findByEmail(googleUser.email);
    if (!account) {
      // Create minimal account in UNPROFILED state without password
      account = await this.accountsService.createFromOAuth({
        email: googleUser.email,
        name: googleUser.name || 'Usuario',
      });
    }
    // If unprofiled, throw to let frontend complete profile
    this.handleAccountStates(account);

    // Generate JWT tokens (same flow as regular login)
    const payload = this.createJwtPayload(account);
    const tokens = await this.createTokenResponse(payload);
    await this.accountsService.setRefreshToken(account.id, tokens.refreshToken);
    return tokens;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: process.env.JWT_SECRET_KEY_ACCESS || 'defaultSecretKey',
      });
      const accountId = payload.sub;
      if (!accountId) throw new BadRequestException('Invalid token payload');
      await this.accountsService.verifyEmail(accountId);
      return { message: 'Email verified successfully' };
    } catch (e) {
      this.logger.error('Email verification failed', e);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const account = await this.accountsService.findByEmail(email);
    if (!account) {
      // Do not reveal whether email exists; return generic success to avoid enumeration
      return { message: messages.verificationEmailSent };
    }
    if (account.isEmailVerified) {
      return { message: messages.emailAlreadyVerified };
    }

    // Rate-limit check
    const resendLimit = Number(process.env.VERIFICATION_RESEND_LIMIT || 5);
    const resendWindowMinutes = Number(
      process.env.VERIFICATION_RESEND_WINDOW_MINUTES || 60,
    );
    if (account.verificationResendCount && account.lastVerificationSentAt) {
      const elapsedMs =
        Date.now() - new Date(account.lastVerificationSentAt).getTime();
      if (
        elapsedMs <= resendWindowMinutes * 60 * 1000 &&
        account.verificationResendCount >= resendLimit
      ) {
        throw new BadRequestException(messages.tooManyVerificationRequests);
      }
    }

    const emailSecret =
      process.env.JWT_SECRET_KEY_EMAIL ||
      process.env.JWT_SECRET_KEY_ACCESS ||
      'defaultEmailSecret';
    const verificationToken = await this.jwtService.signAsync(
      { sub: account.id, email: account.email },
      { expiresIn: '24h', secret: emailSecret },
    );
    const frontendBase =
      process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    const verificationLink = `${frontendBase}/auth/verify-email?token=${verificationToken}`;
    await this.mailService.sendVerificationEmail(
      account.email,
      verificationLink,
    );
    await this.accountsService.recordVerificationSend(account.id);
    return { message: messages.verificationEmailSent };
  }

  async getCurrentUser(payload: UserPayload): Promise<User> {
    const account = await this.accountsService.findById(payload.sub);
    if (!account) {
      throw new UnauthorizedException();
    }
    if (
      [AccountState.SUSPENDED, AccountState.DEACTIVATED].includes(
        account.status,
      )
    ) {
      throw new UnauthorizedException();
    }

    const { email, id, status, role, profile } = account;
    return {
      email,
      id,
      state: status,
      role,
      name: profile?.name || '',
      hasProfile: account.hasProfile,
      birthDate: profile?.birthDate || null,
    };
  }

  async getResendVerificationStatus(
    email: string,
  ): Promise<{ allowed: boolean; secondsToWait?: number }> {
    const account = await this.accountsService.findByEmail(email);
    const resendLimit = Number(process.env.VERIFICATION_RESEND_LIMIT || 5);
    const resendWindowMinutes = Number(
      process.env.VERIFICATION_RESEND_WINDOW_MINUTES || 60,
    );

    // If account doesn't exist, we return allowed=true to not reveal existence
    if (!account) return { allowed: true };
    if (account.isEmailVerified) return { allowed: false, secondsToWait: 0 };

    const last = account.lastVerificationSentAt
      ? new Date(account.lastVerificationSentAt).getTime()
      : 0;
    const windowMs = resendWindowMinutes * 60 * 1000;
    const elapsed = Date.now() - last;

    if (!account.verificationResendCount || last === 0)
      return { allowed: true };

    if (elapsed > windowMs) return { allowed: true };

    if (account.verificationResendCount < resendLimit) return { allowed: true };

    // Must wait until window passes
    const secondsToWait = Math.ceil((windowMs - elapsed) / 1000);
    return { allowed: false, secondsToWait };
  }
}
