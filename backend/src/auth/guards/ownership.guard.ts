import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from 'src/users/accounts/enum/role.enum';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { resource?: any }>();
    const user = request.user;
    const resource = request.resource;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins can always modify resources
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if user is the owner
    if (!resource || resource.userId !== user.id) {
      throw new ForbiddenException(
        'You can only modify resources that belong to you',
      );
    }

    return true;
  }
}
