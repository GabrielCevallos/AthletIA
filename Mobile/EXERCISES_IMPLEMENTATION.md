# 📚 Módulo de Ejercicios - Guía de Implementación

## ✅ Estado Actual

El módulo de ejercicios ha sido completamente implementado con autenticación, manejo de permisos y control de errores.

## 📁 Archivos Creados/Modificados

### 1. **Hook Custom: `hooks/use-exercises.ts`** ✨ NUEVO
- Hook reutilizable que encapsula la lógica de ejercicios
- Valida autenticación antes de hacer requests
- Maneja errores de permisos (401, 403)
- Proporciona métodos para cargar lista y detalle

**Funciones principales:**
```typescript
const { exercises, loading, error, refetch, getExerciseById } = useExercises(category);
```

### 2. **Pantalla de Ejercicios: `app/(tabs)/exercises.tsx`** ✏️ MODIFICADA
**Cambios:**
- Integración del hook `useExercises`
- Validación de autenticación con redirección a login
- Estados de carga y error
- Datos dinámicos desde backend
- Navegación a detalle con parámetros

**Características:**
- ✅ Protección: Verifica token antes de mostrar contenido
- ✅ Carga: Indicador de loading mientras se obtienen datos
- ✅ Errores: Banner informativo con botón reintentar
- ✅ Búsqueda: Filtrado local por nombre
- ✅ Categorías: Filtrado por categoría (backend)
- ✅ Vacío: Estado cuando no hay ejercicios

### 3. **Pantalla de Detalle: `app/exercise-detail/[id].tsx`** ✨ NUEVO
Pantalla completa con:
- Imagen grande del ejercicio
- Información del ejercicio (dificultad, categoría)
- Descripción detallada
- Músculos trabajados
- Equipo necesario
- Instrucciones paso a paso
- Variantes disponibles
- Botón para agregar a rutina

### 4. **Layout de Detalle: `app/exercise-detail/_layout.tsx`** ✨ NUEVO
Configuración del router para la pantalla de detalle

### 5. **Servicio de API: `services/exercises-api.ts`** ✨ NUEVO
Capa de abstracción para llamadas a API con:
- Clase `ExercisesApiError` para manejo de errores estructurado
- Funciones: `fetchExercises()`, `fetchExerciseById()`, `addExerciseToRoutine()`
- Códigos de error: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, NETWORK_ERROR
- Headers con autenticación incluidos

## 🔐 Sistema de Autenticación y Permisos

### Flujo de Control de Acceso

```
┌─────────────────────────────────────────────────────────────────┐
│                    Usuario abre app                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    ¿Token en AsyncStorage?
                    /              \
                 No/                 \Yes
                /                      \
        Login Screen          ¿Token válido en /auth/me?
                                /              \
                             No/                \Yes
                            /                    \
                    Logout + Login          App Normal
                                                 │
                                        GET /exercises?category=X
                                        Headers: Authorization: Bearer TOKEN
                                        /      |      \
                                    401     403    200
                                    /       |       \
                        Refresh/   Access  Lista
                        Logout    Denied   Ejercicios
```

### Validaciones

| Punto | Validación | Acción |
|-------|-----------|--------|
| Pantalla abierta | ¿Token? | Redirigir a login si no existe |
| Cada request | Headers con Bearer token | Incluido automáticamente en hook |
| Respuesta 401 | Token expirado | Mostrar error y permitir reintentar |
| Respuesta 403 | Sin permisos | Mostrar mensaje de acceso denegado |
| Respuesta 200 | Datos válidos | Mostrar ejercicios |

## 📊 Estructura de Datos Esperada del Backend

### Lista de Ejercicios: `GET /exercises?category=chest`

```json
{
  "success": true,
  "data": [
    {
      "id": "ex-001",
      "name": "Press de Banca",
      "category": "chest",
      "difficulty": "Intermedio",
      "description": "Ejercicio fundamental para el pecho",
      "imageUrl": "https://...",
      "instructions": [
        "Acuéstate en el banco",
        "Agarra la barra..."
      ],
      "muscleGroups": ["Pecho", "Tríceps"],
      "equipment": ["Barra", "Banco de Pesas"]
    }
  ]
}
```

### Detalle de Ejercicio: `GET /exercises/:id`

Incluye todo lo anterior más:
```json
{
  "videoUrl": "https://...",
  "variants": [
    {
      "id": "ex-001-v1",
      "name": "Press de Banca con Mancuernas",
      "difficulty": "Principiante"
    }
  ]
}
```

## 🎨 Estilos y Temas

Todos los componentes utilizan el sistema de diseño centralizado:

- **Colores**: `Colors` de `@/constants/theme`
- **Tipografía**: `Typography` de `@/constants/theme`
- **Espaciado**: `Spacing` de `@/constants/theme`
- **Estilos globales**: `GlobalStyles` de `@/styles/global`

### Colores Utilizados

| Elemento | Color |
|----------|-------|
| Título | `Colors.text.primary` |
| Texto normal | `Colors.text.secondary` |
| Texto deshabilitado | `Colors.text.muted` |
| Fondo principal | `Colors.background.DEFAULT` |
| Tarjetas | `Colors.surface.DEFAULT` |
| Primario (botones) | `Colors.primary.DEFAULT` |
| Errores | `Colors.error.DEFAULT` |

## 🔧 Cómo Usar

### En un Componente

```typescript
import { useExercises } from '@/hooks/use-exercises';

export default function MyComponent() {
  const [category, setCategory] = useState('chest');
  const { exercises, loading, error, refetch } = useExercises(category);

  if (loading) return <ActivityIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => <ExerciseCard exercise={item} />}
    />
  );
}
```

### Obtener Detalle de Ejercicio

```typescript
const { getExerciseById } = useExercises();

const exercise = await getExerciseById('ex-001');
```

### Usar Servicio de API Directamente

```typescript
import { fetchExercises, ExercisesApiError } from '@/services/exercises-api';

try {
  const exercises = await fetchExercises({
    token: userToken,
    category: 'chest',
  });
} catch (error) {
  if (error instanceof ExercisesApiError) {
    console.log(error.code); // 'UNAUTHORIZED', 'FORBIDDEN', etc
  }
}
```

## 🚀 Mejoras Futuras

- [ ] Caché local con AsyncStorage
- [ ] Paginación para listas largas
- [ ] Favoritos guardados
- [ ] Historial de ejercicios realizados
- [ ] Compartir ejercicios
- [ ] Búsqueda avanzada (músculos, equipo, etc)
- [ ] Vídeos de demostración
- [ ] Comentarios y valoraciones
- [ ] Sincronización offline

## 📝 Notas Importantes

1. **Autenticación**: El token se obtiene del contexto de autenticación automáticamente
2. **Errores de Red**: Se capturan y convierten en mensajes amigables
3. **Redirección**: Si el usuario no está autenticado, se redirige a login automáticamente
4. **Responsividad**: Todos los componentes se adaptan a diferentes tamaños de pantalla
5. **Accesibilidad**: Se utilizan etiquetas semánticas y colores con suficiente contraste

## 🐛 Debugging

Si algo no funciona:

1. **Verificar token**: `useAuth()` debe retornar un token válido
2. **Verificar URL de API**: Revisar `Config.apiUrl` en `constants/config.ts`
3. **Verificar respuesta**: Usar Network tab en React Native Debugger
4. **Verificar permisos**: Backend debe retornar 200 con datos si usuario tiene permiso

---

**Última actualización**: 31 de Enero de 2026
