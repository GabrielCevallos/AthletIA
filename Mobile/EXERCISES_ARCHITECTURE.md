# 📊 Estructura del Módulo de Ejercicios

## Diagrama de Archivos Creados

```
📱 app/
├── (tabs)/
│   └── exercises.tsx ✏️ MODIFICADO
│       ├── Importa: useExercises, useAuth, useRouter
│       ├── Estados: loading, error, exercises
│       ├── Validación: Redirige a login si no hay token
│       ├── UI: SearchBar, Categories, ExerciseList
│       └── Navegación: → /exercise-detail/[id]
│
└── exercise-detail/ ✨ NUEVO
    ├── _layout.tsx ✨ NUEVO
    │   └── Configura el Stack Navigator
    │
    └── [id].tsx ✨ NUEVO
        ├── Parámetro dinámico: id del ejercicio
        ├── Importa: getExerciseById del hook
        ├── Estados: exercise, loading, error
        ├── UI: Imagen, Instrucciones, Variantes
        └── Funcionalidad: Agregar a rutina

🪝 hooks/
└── use-exercises.ts ✨ NUEVO
    ├── fetchExercises(category): Exercise[]
    ├── getExerciseById(id): Exercise
    ├── Validación de autenticación
    ├── Manejo de errores (401, 403)
    ├── Estados: exercises, loading, error
    └── Refetch automático

🔧 services/
└── exercises-api.ts ✨ NUEVO
    ├── fetchExercises(token, category)
    ├── fetchExerciseById(token, id)
    ├── addExerciseToRoutine(token, exerciseId, routineId)
    ├── ExercisesApiError (clase personalizada)
    └── Manejo de respuestas HTTP

📚 Documentación/
├── EXERCISES_IMPLEMENTATION.md ✨ NUEVO
│   └── Guía completa de implementación
│
├── EXERCISES_TESTING.md ✨ NUEVO
│   └── Casos de test y validación
│
└── EXERCISES_ARCHITECTURE.md (este archivo)
    └── Diagrama de arquitectura
```

## Flujo de Datos

```
┌────────────────────────────────────────────────────────┐
│            Componente (exercises.tsx)                  │
│  - Renderiza UI                                        │
│  - Maneja estados de UI (búsqueda, categoría)         │
│  - Redirige si no hay autenticación                   │
└────────────┬─────────────────────────────────────────┘
             │ Usa
             ▼
┌────────────────────────────────────────────────────────┐
│         Hook Custom (use-exercises.ts)                 │
│  - useExercises(category?)                             │
│  - Obtiene { exercises, loading, error, refetch, etc  │
│  - Valida token automáticamente                        │
│  - Maneja cache implícito                              │
└────────────┬─────────────────────────────────────────┘
             │ Delega a
             ▼
┌────────────────────────────────────────────────────────┐
│      Servicio de API (exercises-api.ts)                │
│  - fetchExercises(token, category)                     │
│  - fetchExerciseById(token, id)                        │
│  - addExerciseToRoutine(token, routineId, exerciseId) │
│  - Manejo de errores HTTP                              │
│  - Headers con Authorization                           │
└────────────┬─────────────────────────────────────────┘
             │ Realiza
             ▼
┌────────────────────────────────────────────────────────┐
│           Backend API                                  │
│  GET /exercises?category=X                             │
│  GET /exercises/:id                                    │
│  POST /routines/:id/exercises                          │
│                                                        │
│  Validación de permisos en backend                     │
└────────────────────────────────────────────────────────┘
```

## Flujo de Componente

```
ExercisesScreen
│
├─ useAuth()
│  └─ { user.token, loading }
│
├─ useExercises(selectedCategory)
│  ├─ useEffect → fetchExercises
│  ├─ State: exercises[], loading, error
│  ├─ Return: { exercises, loading, error, refetch, getExerciseById }
│  └─ Validaciones:
│     ├─ 401 → Error "Sesión expirada"
│     ├─ 403 → Error "No tienes permiso"
│     └─ 200 → Mostrar ejercicios
│
├─ useRouter()
│  └─ router.push('/exercise-detail/[id]')
│
└─ Render:
   ├─ if (authLoading) → Spinner
   ├─ if (error) → ErrorBanner + RetryButton
   ├─ if (loading) → Spinner
   ├─ Categories → ScrollView horizontal
   ├─ SearchBar → Filter local
   ├─ ExerciseList → ScrollView vertical
   │  ├─ if (filteredExercises.length === 0)
   │  │  └─ EmptyState
   │  └─ if (filteredExercises.length > 0)
   │     └─ Pressable → onPress → router.push(...)
   └─ ExerciseDetailScreen
      ├─ useRouter() → { id }
      ├─ useExercises() → { getExerciseById }
      ├─ useEffect → getExerciseById(id)
      └─ Render detalles...
```

## Estados y Transiciones

```
Pantalla Ejercicios:
┌─────────────┐
│ No Logueado │ ──(no token)──> Redirigir a /login
└─────────────┘
       ▲
       │
┌─────────────────────────────────────────────────────────┐
│          Cargando                                       │
│  ├─ authLoading = true                                  │
│  ├─ exercises = []                                      │
│  └─ UI: Spinner                                         │
└──────────────┬──────────────────────────────────────────┘
               │ user.token obtenido
               ▼
┌─────────────────────────────────────────────────────────┐
│          Cargando Ejercicios                            │
│  ├─ loading = true                                      │
│  ├─ exercises = []                                      │
│  ├─ error = null                                        │
│  └─ UI: Spinner + Categorías                            │
└──────────────┬──────────────────────────────────────────┘
               │ API Response 200
               ▼
┌──────────────────────────────────┐
│      Listo - Mostrando Datos     │
│  ├─ loading = false              │
│  ├─ exercises = [...]            │
│  ├─ error = null                 │
│  └─ UI: Completa                 │
└──────────────┬─────────────────┬─┘
               │                 │
       ┌───────┴────────┐  ┌─────┴──────┐
       │ Usuario clicka │  │   Busca    │
       │  categoría     │  │  ejercicio │
       └───────┬────────┘  └─────┬──────┘
               │                 │
               └────────┬────────┘
                        │
                        ▼
            API Request con nuevo filtro
                        │
               ┌────────┴────────┐
               │                 │
            200 OK           Error
               │                 │
               ▼                 ▼
        Actualizar lista  Error Banner
                          + Retry Button
```

## Interacciones de Seguridad

```
┌─────────────────────────────────────────┐
│   Usuario sin token intenta acceder     │
└───────────────────┬─────────────────────┘
                    │
                    ▼
        ¿user?.token existe?
        ├─ NO  → router.replace('/login')
        └─ SÍ  → Continuar
                    │
                    ▼
        GET /exercises
        Headers: { Authorization: Bearer TOKEN }
                    │
                    ├─ 401 ──> Error "Sesión expirada"
                    │          + Botón Reintentar
                    │
                    ├─ 403 ──> Error "No tienes permiso"
                    │          + Mostrar supportEmail
                    │
                    ├─ 200 ──> Mostrar ejercicios
                    │
                    └─ 0xx ──> Error "Error de conexión"
                             + Botón Reintentar
```

## Componentes Reutilizables

```
UI Patterns Utilizados:

1. Loading Spinner
   └─ <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />

2. Error Banner
   └─ Fondo rojo, ícono, mensaje, botón reintentar

3. Empty State
   ├─ Ícono grande (🏋️)
   ├─ Título
   └─ Mensaje descriptivo

4. Exercise Card
   ├─ Imagen pequeña (80x80)
   ├─ Nombre
   ├─ Meta (categoría • nivel)
   └─ Chevron indicador

5. Category Pill
   ├─ Background variable (gray/cyan)
   ├─ Texto variable (gray/white)
   └─ Border radius full

6. Section Card (en detalle)
   ├─ Título de sección
   ├─ Contenido variable
   └─ Padding consistente
```

## Performance Considerations

```
Optimizaciones Implementadas:
├─ Hook custom previene re-renders innecesarios
├─ useCallback para funciones estables
├─ useEffect con dependencias correctas
├─ Filtro de búsqueda local (sin API call)
├─ Categorías sin re-fetch innecesarios
└─ Tipado correcto previene bugs

Posibles Mejoras:
├─ Agregar FlatList para listas muy largas
├─ Implementar virtualización
├─ Caché con AsyncStorage
├─ Paginación serverside
└─ Debounce en búsqueda
```

## Integración con Auth Context

```
AuthContext proporciona:
├─ user: { token, hasCompletedProfile }
├─ loading: boolean
├─ signIn(): Promise
├─ signOut(): Promise
├─ refresh(): Promise
└─ setProfileCompleted(): Promise

El hook use-exercises consume:
└─ Valida user?.token en cada llamada

El componente exercises.tsx consume:
├─ Redirige si !user?.token
└─ Muestra spinner si loading
```

---

**Diagrama actualizado**: 31 de Enero de 2026
