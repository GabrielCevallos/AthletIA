import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitCleanupService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(RateLimitCleanupService.name);
  private cleanupInterval: NodeJS.Timeout;

  constructor(private rateLimitService: RateLimitService) {}

  onModuleInit() {
    // Ejecutar limpieza cada 30 minutos
    this.cleanupInterval = setInterval(() => {
      this.rateLimitService.cleanupExpiredRecords(60 * 60 * 1000);
    }, 30 * 60 * 1000);

    this.logger.log('RateLimitCleanupService inicializado');
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
