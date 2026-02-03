import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitService } from './rate-limit.service';
import { RATE_LIMIT_KEY, RateLimitConfig } from './rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rateLimitService: RateLimitService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.get<RateLimitConfig>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!config) {
      return true; // Sin configuración, permitir
    }

    const request = context.switchToHttp().getRequest();
    const key = config.keyGenerator
      ? config.keyGenerator(request)
      : `${request.ip}-${request.path}`;

    const status = this.rateLimitService.recordFailedAttempt(
      key,
      config.maxAttempts,
      config.windowMs,
      config.blockDurationMs,
    );

    if (status.blocked) {
      throw new HttpException(
        status.message || 'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Guardar en el request para acceso posterior
    (request as any).rateLimitKey = key;
    (request as any).rateLimitStatus = status;

    return true;
  }
}
