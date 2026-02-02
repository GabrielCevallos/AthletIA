import { SetMetadata } from '@nestjs/common';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // milisegundos
  blockDurationMs: number; // milisegundos
  keyGenerator?: (req: any) => string;
}

export const RATE_LIMIT_KEY = 'rateLimit';

export const RateLimit = (config: Partial<RateLimitConfig>) => {
  const defaultConfig: RateLimitConfig = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos
    keyGenerator: (req: any) => req.body?.email || req.ip,
  };

  return SetMetadata(RATE_LIMIT_KEY, { ...defaultConfig, ...config });
};
