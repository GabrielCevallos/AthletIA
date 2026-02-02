import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from 'src/users/accounts/enum/role.enum';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload | undefined;

    if (!user || user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Only administrators can perform this action',
      );
    }

    return true;
  }
}
