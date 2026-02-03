import { Injectable, Logger } from '@nestjs/common';

interface RateLimitStore {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil?: number;
}

@Injectable()
export class RateLimitService {
  private logger = new Logger(RateLimitService.name);
  private store: Map<string, RateLimitStore> = new Map();

  /**
   * Registra un intento fallido y verifica si debe bloquearse
   * @param key Identificador único (ej: email, IP)
   * @param maxAttempts Número máximo de intentos permitidos
   * @param windowMs Ventana de tiempo en milisegundos
   * @param blockDurationMs Duración del bloqueo en milisegundos
   * @returns Objeto con información de rate limit
   */
  recordFailedAttempt(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000, // 15 minutos
    blockDurationMs: number = 30 * 60 * 1000, // 30 minutos
  ): {
    blocked: boolean;
    attempts: number;
    remainingTime?: number;
    message?: string;
  } {
    const now = Date.now();
    const record = this.store.get(key);

    // Si está bloqueado, verificar si el bloqueo ha expirado
    if (record?.blockedUntil && now < record.blockedUntil) {
      const remainingTime = record.blockedUntil - now;
      return {
        blocked: true,
        attempts: record.attempts,
        remainingTime,
        message: `Demasiados intentos fallidos. Intenta nuevamente en ${Math.ceil(remainingTime / 1000)} segundos.`,
      };
    }

    // Si la ventana de tiempo ha expirado, reiniciar
    if (!record || now - record.firstAttemptTime > windowMs) {
      this.store.set(key, {
        attempts: 1,
        firstAttemptTime: now,
      });
      return { blocked: false, attempts: 1 };
    }

    // Incrementar intentos
    record.attempts++;

    // Si se alcanza el límite, aplicar bloqueo
    if (record.attempts >= maxAttempts) {
      record.blockedUntil = now + blockDurationMs;
      this.logger.warn(
        `Rate limit excedido para ${key}. Bloqueado por ${blockDurationMs / 1000} segundos.`,
      );
      return {
        blocked: true,
        attempts: record.attempts,
        remainingTime: blockDurationMs,
        message: `Demasiados intentos fallidos. Intenta nuevamente en ${Math.ceil(blockDurationMs / 1000)} segundos.`,
      };
    }

    return { blocked: false, attempts: record.attempts };
  }

  /**
   * Registra un intento exitoso (limpia los intentos fallidos)
   */
  recordSuccessfulAttempt(key: string): void {
    this.store.delete(key);
    this.logger.debug(`Intento exitoso para ${key}. Contador reiniciado.`);
  }

  /**
   * Obtiene el estado actual del rate limit
   */
  getStatus(
    key: string,
  ): {
    blocked: boolean;
    attempts: number;
    remainingTime?: number;
  } {
    const record = this.store.get(key);
    const now = Date.now();

    if (!record) {
      return { blocked: false, attempts: 0 };
    }

    if (record.blockedUntil && now < record.blockedUntil) {
      return {
        blocked: true,
        attempts: record.attempts,
        remainingTime: record.blockedUntil - now,
      };
    }

    return { blocked: false, attempts: record.attempts };
  }

  /**
   * Limpia el registro de un usuario
   */
  resetKey(key: string): void {
    this.store.delete(key);
    this.logger.debug(`Registro de ${key} reiniciado.`);
  }

  /**
   * Limpia registros expirados (útil para evitar memory leaks)
   */
  cleanupExpiredRecords(windowMs: number = 60 * 60 * 1000): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, record] of this.store.entries()) {
      if (now - record.firstAttemptTime > windowMs) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug(`Limpieza: ${cleaned} registros expirados eliminados.`);
    }
  }
}
