/**
 * Manejador centralizado de errores de API
 * Detecta errores de sesión expirada (401) y notifica al contexto de autenticación
 */

type SessionExpiredCallback = () => Promise<void>;

let sessionExpiredCallbacks: SessionExpiredCallback[] = [];

/**
 * Registra un callback para cuando la sesión expire
 */
export function onSessionExpired(callback: SessionExpiredCallback): void {
  sessionExpiredCallbacks.push(callback);
}

/**
 * Limpia los callbacks registrados
 */
export function clearSessionExpiredCallbacks(): void {
  sessionExpiredCallbacks = [];
}

/**
 * Notifica a todos los listeners que la sesión ha expirado
 */
async function notifySessionExpired(): Promise<void> {
  console.warn('🔐 Sesión expirada detectada - notificando a listeners');
  const callbacks = [...sessionExpiredCallbacks];
  for (const callback of callbacks) {
    try {
      await callback();
    } catch (error) {
      console.error('Error en callback de sesión expirada:', error);
    }
  }
}

/**
 * Maneja errores de API y detecta sesión expirada
 */
export async function handleApiError(error: unknown): Promise<void> {
  // Verifica si es un error de UNAUTHORIZED (401)
  if (error instanceof Error) {
    if (
      error.message.includes('Sesión expirada') ||
      error.message.includes('session expired') ||
      (error as any).statusCode === 401 ||
      (error as any).code === 'UNAUTHORIZED'
    ) {
      await notifySessionExpired();
    }
  }
}

/**
 * Exporta la clase personalizada para mantener compatibilidad
 */
export class ApiSessionError extends Error {
  constructor(message: string = 'Sesión expirada') {
    super(message);
    this.name = 'ApiSessionError';
  }
}
