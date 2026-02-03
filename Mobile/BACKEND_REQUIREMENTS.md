# 🔌 Guía para Backend - API de Ejercicios

## Resumen Ejecutivo

La aplicación móvil está lista para consumir la API de ejercicios. Este documento define exactamente qué endpoints se necesitan, qué datos esperan y cómo validar los permisos.

## 📋 Endpoints Requeridos

### 1. GET `/exercises` - Listar Ejercicios

**Descripción**: Obtiene lista de ejercicios con filtros opcionales

**Autenticación**: Requerida
- Header: `Authorization: Bearer {accessToken}`
- Validar que el token sea válido y no esté expirado
- Retornar 401 si el token es inválido

**Parámetros de Query**:
```
?category=chest     // Filtrar por categoría
```

Categorías válidas: `chest`, `back`, `legs`, `cardio`, `arms`

**Validación de Permisos**:
- Si el usuario no tiene acceso a la biblioteca completa → 403 Forbidden
- Si el usuario está baneado → 403 Forbidden
- Si el usuario es nuevo y no completó el perfil → 200 OK (mostrar ejercicios básicos)

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ex-001",
      "name": "Press de Banca",
      "category": "chest",
      "difficulty": "Intermedio",
      "description": "Ejercicio fundamental para el pecho...",
      "imageUrl": "https://cdn.example.com/exercises/bench-press.jpg",
      "instructions": [
        "Acuéstate en el banco",
        "Coloca los pies en el piso",
        "Agarra la barra con las manos separadas al ancho de los hombros",
        "Baja la barra lentamente hasta el pecho",
        "Empuja hacia arriba explosivamente",
        "Repite por el número de repeticiones"
      ],
      "muscleGroups": ["Pecho", "Tríceps", "Hombros"],
      "equipment": ["Barra", "Banco de Pesas", "Pesas"]
    },
    {
      "id": "ex-002",
      "name": "Dominadas",
      "category": "back",
      "difficulty": "Avanzado",
      "description": "Levanta tu peso corporal usando una barra...",
      "imageUrl": "https://cdn.example.com/exercises/pullups.jpg",
      "instructions": [...],
      "muscleGroups": ["Espalda", "Bíceps"],
      "equipment": ["Barra Horizontal"]
    }
  ]
}
```

**Errores**:
```json
// 401 Unauthorized
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Token inválido o expirado"
}

// 403 Forbidden
{
  "success": false,
  "code": "FORBIDDEN",
  "message": "No tienes permiso para acceder a esta sección"
}

// 500 Server Error
{
  "success": false,
  "code": "INTERNAL_ERROR",
  "message": "Error al cargar ejercicios"
}
```

---

### 2. GET `/exercises/:id` - Detalle de Ejercicio

**Descripción**: Obtiene información completa de un ejercicio específico

**Autenticación**: Requerida
- Header: `Authorization: Bearer {accessToken}`

**Parámetros**:
- `:id` - ID del ejercicio (string, obligatorio)

**Validación de Permisos**:
- Si el usuario no puede acceder a este ejercicio → 403 Forbidden
- Si el ejercicio no existe → 404 Not Found

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "ex-001",
    "name": "Press de Banca",
    "category": "chest",
    "difficulty": "Intermedio",
    "description": "Ejercicio fundamental para el desarrollo del pecho...",
    "imageUrl": "https://cdn.example.com/exercises/bench-press.jpg",
    "instructions": [
      "Acuéstate en el banco",
      "Coloca los pies en el piso",
      "Agarra la barra con las manos separadas al ancho de los hombros",
      "Baja la barra lentamente hasta el pecho",
      "Empuja hacia arriba explosivamente",
      "Repite por el número de repeticiones"
    ],
    "muscleGroups": ["Pecho", "Tríceps", "Hombros"],
    "equipment": ["Barra", "Banco de Pesas", "Pesas"],
    "videoUrl": "https://youtube.com/embed/...",
    "variants": [
      {
        "id": "ex-001-v1",
        "name": "Press de Banca con Mancuernas",
        "category": "chest",
        "difficulty": "Principiante",
        "description": "Variante más segura para principiantes",
        "imageUrl": "https://cdn.example.com/exercises/dumbbell-press.jpg"
      }
    ],
    "recommendations": [
      "Mantén los codos a 45 grados",
      "No arquees demasiado la espalda",
      "Controla la velocidad de bajada"
    ]
  }
}
```

**Errores**:
```json
// 401 Unauthorized
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Token inválido o expirado"
}

// 403 Forbidden
{
  "success": false,
  "code": "FORBIDDEN",
  "message": "No tienes permiso para acceder a este ejercicio"
}

// 404 Not Found
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "Ejercicio no encontrado"
}
```

---

### 3. POST `/routines/:routineId/exercises` - Agregar Ejercicio a Rutina

**Descripción**: Agrega un ejercicio a una rutina existente

**Autenticación**: Requerida
- Header: `Authorization: Bearer {accessToken}`

**Parámetros**:
- `:routineId` - ID de la rutina (string, obligatorio)

**Body** (JSON):
```json
{
  "exerciseId": "ex-001"
}
```

**Validación de Permisos**:
- Si el usuario no es el dueño de la rutina → 403 Forbidden
- Si la rutina está cerrada/archivada → 403 Forbidden
- Si el ejercicio no existe → 404 Not Found
- Si el ejercicio ya está en la rutina → Opcional: 409 Conflict o 200 OK

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Ejercicio agregado a la rutina",
  "data": {
    "routineId": "routine-001",
    "exerciseId": "ex-001",
    "position": 5,
    "addedAt": "2026-01-31T15:30:00Z"
  }
}
```

**Errores**:
```json
// 401 Unauthorized
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Token inválido"
}

// 403 Forbidden
{
  "success": false,
  "code": "FORBIDDEN",
  "message": "No tienes permiso para modificar esta rutina"
}

// 404 Not Found
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "Rutina o ejercicio no encontrado"
}

// 409 Conflict (opcional)
{
  "success": false,
  "code": "EXERCISE_ALREADY_IN_ROUTINE",
  "message": "Este ejercicio ya está en la rutina"
}
```

---

## 📊 Modelo de Datos Esperado

### Exercise Type
```typescript
type Exercise = {
  id: string;                           // UUID o identificador único
  name: string;                         // Ej: "Press de Banca"
  category: 'chest' | 'back' | 'legs' | 'cardio' | 'arms';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  description: string;                  // Descripción larga del ejercicio
  imageUrl: string;                     // URL de imagen HTTPS
  instructions: string[];               // Paso a paso del ejercicio
  muscleGroups: string[];               // Grupos musculares trabajados
  equipment?: string[];                 // Equipo necesario (opcional)
  videoUrl?: string;                    // URL de vídeo demostración (opcional)
  variants?: Exercise[];                // Variantes del ejercicio (opcional)
  recommendations?: string[];           // Consejos de ejecución (opcional)
  createdAt?: string;                   // ISO 8601 timestamp
  updatedAt?: string;                   // ISO 8601 timestamp
};
```

---

## 🔒 Sistema de Permisos

### Niveles de Acceso

```typescript
type AccessLevel = 
  | 'ADMIN'           // Acceso a todo
  | 'PREMIUM'         // Acceso a biblioteca completa
  | 'USER'            // Acceso básico
  | 'GUEST'           // Acceso limitado
  | 'BANNED'          // Sin acceso;
```

### Lógica de Validación

```
GET /exercises
├─ Token válido?
│  ├─ NO → 401 Unauthorized
│  └─ SÍ → Continuar
├─ Usuario activo?
│  ├─ BANNED → 403 Forbidden
│  └─ ACTIVE → Continuar
├─ Tiene acceso a biblioteca?
│  ├─ GUEST/USER/PREMIUM/ADMIN → 200 OK (diferente contenido según nivel)
│  └─ Otro → 403 Forbidden

GET /exercises/:id
├─ Token válido?
│  ├─ NO → 401 Unauthorized
│  └─ SÍ → Continuar
├─ Ejercicio existe?
│  ├─ NO → 404 Not Found
│  └─ SÍ → Continuar
├─ Usuario puede ver este ejercicio?
│  ├─ NO → 403 Forbidden
│  └─ SÍ → 200 OK

POST /routines/:routineId/exercises
├─ Token válido?
│  ├─ NO → 401 Unauthorized
│  └─ SÍ → Continuar
├─ Usuario es dueño de la rutina?
│  ├─ NO → 403 Forbidden
│  └─ SÍ → Continuar
├─ Rutina existe y está activa?
│  ├─ NO → 404/403
│  └─ SÍ → Continuar
├─ Ejercicio existe?
│  ├─ NO → 404 Not Found
│  └─ SÍ → 200 OK
```

---

## 🧪 Casos de Test del Backend

### Test 1: Autenticación
```
✓ Sin token → 401
✓ Token inválido → 401
✓ Token expirado → 401
✓ Token válido → 200 / 403 (según permisos)
```

### Test 2: Permisos
```
✓ Usuario GUEST → acceso limitado
✓ Usuario USER → acceso básico
✓ Usuario PREMIUM → acceso completo
✓ Usuario BANNED → 403
```

### Test 3: Datos
```
✓ GET /exercises → retorna array válido
✓ GET /exercises?category=chest → filtra correctamente
✓ GET /exercises/:id → retorna objeto válido
✓ POST /routines/:id/exercises → agrega correctamente
```

### Test 4: Errores
```
✓ Ejercicio no existe → 404
✓ Rutina no existe → 404
✓ Rutina no es del usuario → 403
✓ API down → 500 con mensaje
```

---

## 📝 Notas Importantes

1. **HTTPS Obligatorio**: Todas las URLs de imágenes y vídeos deben ser HTTPS
2. **CORS**: Configurar CORS para permitir requests desde la app mobile
3. **Rate Limiting**: Opcional pero recomendado para evitar abuso
4. **Caché**: Las respuestas pueden ser cacheadas por la app
5. **Timestamps**: Usar ISO 8601 para fechas
6. **Validación**: Validar todos los datos en el backend, no confiar en el cliente
7. **Seguridad**: Nunca exponer tokens en logs
8. **Documentación**: Mantener Swagger/OpenAPI actualizado

---

## 🚀 Checklist para Implementación

- [ ] Endpoint GET /exercises implementado
- [ ] Endpoint GET /exercises/:id implementado
- [ ] Endpoint POST /routines/:id/exercises implementado
- [ ] Autenticación (JWT Bearer token)
- [ ] Validación de permisos por nivel de usuario
- [ ] Manejo de errores HTTP correcto
- [ ] CORS configurado
- [ ] Tests unitarios de endpoints
- [ ] Tests de integración
- [ ] Documentación en Swagger
- [ ] Rate limiting (opcional)
- [ ] Logging de requests importantes

---

**Última actualización**: 31 de Enero de 2026
**Versión**: 1.0
