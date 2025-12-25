import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/auth/guards/decorators/public.decorator';
import { AccountsService } from 'src/users/accounts/accounts.service';
import { AccountState } from 'src/users/accounts/enum/account-states.enum';
import { UserPayload } from '../interfaces/user-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private accountsService: AccountsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify<UserPayload>(token, {
        secret: jwtConstants.secret,
      });
      const account = await this.accountsService.findByEmail(payload.email);
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
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }
}
