**Integración App Móvil**

Documentación de los endpoints consumidos por la aplicación móvil / frontend, ejemplos de solicitud y respuesta, capturas de pantalla sugeridas y evidencia del manejo de errores. No incluir credenciales ni valores sensibles.

**Endpoints consumidos**
- **`POST /auth/refresh-token`**: Refresca tokens (usado por el interceptor para renovar `accessToken`). (Ver implementación de backend en [backend/src/auth/auth.controller.ts](backend/src/auth/auth.controller.ts#L1-L80)).
- **`POST /auth/login`**: Inicio de sesión (emite `accessToken` y `refreshToken`).
- **`POST /auth/google/mobile`**: Login vía token Google para móvil.
- **`POST /ai/generate-exercise`**: Genera una descripción de ejercicio (usado por la UI). Implementación consumida vía `fetch` en el frontend.
- **`POST /workout/exercises`**: Crear ejercicio.
- **`GET /workout/exercises`**: Listar ejercicios (paginado).
- **`GET /workout/exercises/:id`**: Obtener ejercicio por id.
- **`PATCH /workout/exercises/:id`**: Actualizar ejercicio.

**Formato de respuesta**
- Todas las respuestas siguen el wrapper `ResponseBody<T>` del backend: `{ success: boolean, message: string, data?: T, errors?: string[] }` (ver [backend/src/common/response/api.response.ts](backend/src/common/response/api.response.ts#L1-L40)).

**Ejemplos de uso**

### Crear un ejercicio
**`POST /workout/exercises`**

**Request (JSON):**
```json
{
    "name": "Bench Press",
    "description": "Barbell bench press on a flat bench.",
    "equipment": "barbell",
    "video": "https://example.com/video",
    "minSets": 3,
    "maxSets": 5,
    "minReps": 8,
    "maxReps": 12,
    "minRestTime": 60,
    "maxRestTime": 120,
    "muscleTarget": ["chest", "triceps"],
    "exerciseType": ["strength"],
    "instructions": ["Lie on bench", "Grip bar", "Lower bar", "Press up"]
}
```

**Respuesta exitosa (HTTP 201):**
```json
{
    "success": true,
    "message": "Exercise created successfully",
    "data": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Bench Press",
        "description": "Barbell bench press on a flat bench.",
        "equipment": "barbell",
        "video": "https://example.com/video",
        "minSets": 3,
        "maxSets": 5,
        "minReps": 8,
        "maxReps": 12,
        "minRestTime": 60,
        "maxRestTime": 120,
        "muscleTarget": ["chest", "triceps"],
        "exerciseType": ["strength"],
        "createdAt": "2025-12-01T12:00:00.000Z",
        "updatedAt": "2025-12-01T12:00:00.000Z"
    }
}
```


**Ejemplo de error de validación (HTTP 400):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        "description must be at least 10 characters",
        "minSets must be >= 1"
    ]
}
```

**Capturas de pantalla **
- Añade capturas en `docs/screenshots/` y referéncialas aquí. Ejemplos sugeridos:
  - `docs/screenshots/login.png` — pantalla de login.
  - `docs/screenshots/dashboard.png` — pantalla principal con lista de ejercicios.
  - `docs/screenshots/create_exercise.png` — formulario de creación de ejercicio.


<img width="400" alt="image" src="https://github.com/user-attachments/assets/db37be2a-26ed-4d1c-b9c2-a2596fc2e00e" />
<img width="400" alt="image" src="https://github.com/user-attachments/assets/f9df45d0-01e1-4223-8320-65ac2a058aae" />
<img width="400" alt="image" src="https://github.com/user-attachments/assets/ecf05b9d-a70c-4157-a2d9-2336ca8295ee" />
<img width="400"  alt="image" src="https://github.com/user-attachments/assets/d509c70f-b9f3-4df5-be90-b352e4e81151" />

**Evidencia del manejo de errores y tokens**
- El frontend implementa interceptores de Axios que:
  - Añaden el `Authorization: Bearer <accessToken>` a las solicitudes cuando existe (ver [Frontend/src/lib/api.ts](Frontend/src/lib/api.ts#L18-L26)).
  - Detectan 401 y ejecutan flujo de refresco usando `POST /auth/refresh-token` (ver [Frontend/src/lib/api.ts](Frontend/src/lib/api.ts#L29-L78)).

- Manejo de errores en `saveExercise`:
  - Validaciones previas al envío (campos requeridos, tipos, URLs válidas) y logs detallados (`console.error`) con `status` y `data` cuando falla una petición (ver [Frontend/src/lib/api.ts](Frontend/src/lib/api.ts#L113-L220)).
  - Mensaje mejorado para timeouts (`Timeout: El servidor tardó demasiado en responder...`).

**Buenas prácticas y precauciones (no incluir datos sensibles)**
- Nunca incluir en el documento tokens, claves privadas, contraseñas ni el contenido de `.env`.
- Variables de entorno se configuran en `Frontend/.env` con `VITE_API_URL` (usa `http://localhost:3000` en desarrollo). Si compartes el README, reemplaza IPs/URLs privadas por placeholders.
- Para capturas que muestren datos reales (usuarios, emails), ofusca o usa cuentas de prueba.

**Pasos rápidos para generar la evidencia localmente**
1. Levanta el backend (`npm install` y `npm run start:dev` en `backend/`).
2. Configura `Frontend/.env` con `VITE_API_URL=http://localhost:3000`.
3. Levanta el frontend (`npm install` y `npm run dev` en `Frontend/`).
4. En la consola del navegador verás los `console.log` generados por `saveExercise` y los interceptores (tokens añadidos, refresco, errores con `status` y `data`).
