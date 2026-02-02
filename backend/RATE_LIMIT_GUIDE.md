## Protección contra Ataques de Fuerza Bruta - Guía de Implementación

### ✅ Implementación Completada

Se ha implementado un sistema completo de protección contra ataques de fuerza bruta con los siguientes componentes:

### Archivos Creados

1. **`src/common/guards/rate-limit.service.ts`**
   - Servicio principal que gestiona los intentos fallidos
   - Registra intentos con ventana deslizante temporal
   - Implementa bloqueo automático después de N intentos
   - Limpieza automática de registros expirados

2. **`src/common/guards/rate-limit.decorator.ts`**
   - Decorador `@RateLimit()` para configuración por endpoint
   - Configuración flexible con valores por defecto

3. **`src/common/guards/rate-limit.guard.ts`**
   - Guard que intercepta solicitudes y valida rate limit
   - Retorna error HTTP 429 cuando se excede el límite
   - Mensaje claro sobre tiempo de espera

4. **`src/common/guards/rate-limit-cleanup.service.ts`**
   - Limpieza automática cada 30 minutos
   - Previene memory leaks
   - Implementa OnModuleInit/OnModuleDestroy

### Archivos Modificados

1. **`src/auth/auth.service.ts`**
   - Inyectado `RateLimitService`
   - Método `signIn()` ahora registra intentos fallidos
   - Método `signIn()` limpia contador en login exitoso

2. **`src/auth/auth.controller.ts`**
   - Decorador `@RateLimit()` en endpoint `/login`
   - Decorador `@RateLimit()` en endpoint `/resend-verification`
   - Límites: 5 intentos en 15 minutos para login, 1 hora para verification

3. **`src/auth/auth.module.ts`**
   - Importados y proveídos `RateLimitService` y `RateLimitCleanupService`
   - Servicios exportados para uso en otros módulos

4. **`src/main.ts`**
   - Guard global `RateLimitGuard` aplicado a toda la aplicación
   - Se ejecuta antes de otros guards

### Configuración Actual

#### Login (`POST /auth/login`)
```
- Máximo: 5 intentos fallidos
- Ventana: 15 minutos
- Bloqueo: 30 minutos
- Clave: email del usuario
```

#### Resend Verification (`POST /auth/resend-verification`)
```
- Máximo: 5 intentos
- Ventana: 1 hora
- Bloqueo: 1 hora
- Clave: email del usuario
```

### Cómo Personalizar Rate Limit

Puedes ajustar los límites en cada endpoint modificando el decorador:

```typescript
@RateLimit({
  maxAttempts: 10,           // Número máximo de intentos
  windowMs: 10 * 60 * 1000,  // Ventana de tiempo en ms (10 minutos)
  blockDurationMs: 60 * 60 * 1000, // Duración del bloqueo en ms (1 hora)
  keyGenerator: (req) => req.body?.email || req.ip, // Clave única
})
```

### Cómo Agregar Rate Limit a Otros Endpoints

```typescript
@Post('otro-endpoint')
@RateLimit({
  maxAttempts: 3,
  windowMs: 5 * 60 * 1000, // 5 minutos
  blockDurationMs: 15 * 60 * 1000, // 15 minutos
})
async miEndpoint() {
  // Tu lógica aquí
}
```

### Cómo Acceder a Información del Rate Limit

Dentro de tus métodos, puedes acceder a la información del rate limit:

```typescript
async miMetodo(@Req() req: any) {
  const rateLimitInfo = req.rateLimitStatus; // { blocked: false, attempts: 1 }
  const clave = req.rateLimitKey; // "usuario@email.com"
}
```

### Inyectar RateLimitService en Otros Servicios

```typescript
import { RateLimitService } from 'src/common/guards/rate-limit.service';

export class MiServicio {
  constructor(private rateLimitService: RateLimitService) {}
  
  miMetodo() {
    // Registrar intento fallido
    const resultado = this.rateLimitService.recordFailedAttempt(
      'clave-unica',
      5, // maxAttempts
      15 * 60 * 1000, // windowMs
      30 * 60 * 1000 // blockDurationMs
    );
    
    if (resultado.blocked) {
      console.log(`Bloqueado. Reintentar en: ${resultado.remainingTime}ms`);
    }
    
    // Registrar intento exitoso (limpia el contador)
    this.rateLimitService.recordSuccessfulAttempt('clave-unica');
    
    // Obtener estado actual
    const estado = this.rateLimitService.getStatus('clave-unica');
    
    // Resetear clave
    this.rateLimitService.resetKey('clave-unica');
  }
}
```

### Respuesta HTTP cuando se Excede Límite

```json
{
  "statusCode": 429,
  "message": "Demasiados intentos fallidos. Intenta nuevamente en 1800 segundos.",
  "error": "Too Many Requests"
}
```

### Casos de Uso Protegidos

✅ **Login**: Protege contra ataques de fuerza bruta en contraseñas
✅ **Email Verification**: Evita spam de intentos de verificación
✅ **Password Reset**: Puede extenderse para proteger recuperación de contraseña
✅ **Cualquier endpoint crítico**: Configurable para cualquier endpoint que necesite protección

### Ventajas de la Implementación

- 🛡️ **En memoria**: Rápido, sin dependencias externas
- 🔄 **Ventana deslizante**: Más preciso que rate limiting fijo
- 🧹 **Auto-limpieza**: Previene memory leaks
- ⚙️ **Configurable**: Cada endpoint puede tener sus propios límites
- 📊 **Observable**: Logs claros de bloqueos y límites excedidos
- 🎯 **Por usuario/email**: Evita enumeration attacks

### Notas de Seguridad

⚠️ **En Producción**: Considera usar Redis para rate limiting en múltiples instancias
⚠️ **IP Spoofing**: El `req.ip` puede ser spoofed; considera headers `X-Forwarded-For`
⚠️ **Bloqueo Permanente**: Los registros se limpian automáticamente cada 30 minutos

### Siguiente Paso Recomendado

Implementar alertas cuando se detecten patrones de ataque (múltiples IPs, múltiples usuarios).
