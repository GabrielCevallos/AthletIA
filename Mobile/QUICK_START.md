# ⚡ QUICK START - Módulo de Ejercicios

**Tiempo de lectura**: 5 minutos  
**Para**: Desarrolladores que quieren entender la implementación rápidamente

---

## 🎯 Lo que se implementó

Un módulo completo de ejercicios en la app móvil que:
- Muestra una biblioteca de ejercicios
- Permite buscar y filtrar
- Muestra detalles de cada ejercicio
- Valida autenticación y permisos
- Maneja errores gracefully

---

## 📂 Archivos Principales (5 archivos)

### 1. **Hook Custom**: `hooks/use-exercises.ts`
```typescript
const { exercises, loading, error, refetch, getExerciseById } = useExercises('chest');
```
- Encapsula toda la lógica de ejercicios
- Valida token automáticamente
- Maneja errores HTTP

### 2. **Pantalla Principal**: `app/(tabs)/exercises.tsx` (MODIFICADO)
```typescript
// Lo que hace:
✓ Valida que haya token (redirige a login si no)
✓ Carga ejercicios del hook
✓ Muestra búsqueda y filtros
✓ Navega a detalle
```

### 3. **Pantalla de Detalle**: `app/exercise-detail/[id].tsx`
```typescript
// Lo que hace:
✓ Carga ejercicio específico
✓ Muestra instrucciones paso a paso
✓ Muestra variantes
✓ Botón para agregar a rutina
```

### 4. **Servicio de API**: `services/exercises-api.ts`
```typescript
// Funciones:
- fetchExercises(token, category?)
- fetchExerciseById(token, id)
- addExerciseToRoutine(token, routineId, exerciseId)
```

### 5. **Layout**: `app/exercise-detail/_layout.tsx`
```typescript
// Configura el router para pantalla de detalle
```

---

## 🚀 Cómo Funciona

### Flujo Simple

```
Usuario abre app
    ↓
¿Tiene token?
├─ NO  → Ir a login
└─ SÍ  → Ver ejercicios
    ↓
useExercises hook
    ├─ Valida token
    ├─ Hace GET /exercises
    └─ Retorna datos o error
    ↓
Renderizar lista
    ├─ Si cargando → Spinner
    ├─ Si error → Error banner
    └─ Si datos → Lista de ejercicios
```

### Detalle de un Ejercicio

```
Usuario clickea un ejercicio
    ↓
router.push('/exercise-detail/123')
    ↓
[id].tsx carga
    ├─ Obtiene ID de params
    ├─ Llama getExerciseById(id)
    └─ Muestra detalles
```

---

## 📚 Casos de Uso

### Mostrar Lista de Ejercicios

```typescript
export default function ExercisesScreen() {
  const { exercises, loading, error } = useExercises('chest');
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => <ExerciseCard exercise={item} />}
    />
  );
}
```

### Filtrar por Categoría

```typescript
const [category, setCategory] = useState('chest');
const { exercises } = useExercises(category);

// Cambiar categoría actualiza automáticamente
setCategory('back'); // ← Hook se actualiza
```

### Obtener Detalle

```typescript
const { getExerciseById } = useExercises();

const exercise = await getExerciseById('ex-001');
console.log(exercise.name); // "Press de Banca"
```

---

## 🔐 Autenticación Explicada

### Cómo se Valida

1. **En el Hook**: Verifica `user?.token` del context
2. **En cada Request**: Incluye `Authorization: Bearer {token}` en headers
3. **En la Respuesta**: 
   - `401` → Error "Sesión expirada"
   - `403` → Error "No tienes permiso"
   - `200` → Mostrar datos

### Si Falla la Autenticación

```typescript
// Usuario sin token
useExercises() 
  → setError('Usuario no autenticado')
  → Mostrar error

// Token expirado
GET /exercises (401)
  → Error "Sesión expirada"
  → Botón "Reintentar"
```

---

## 🎨 Estilos

Todos usan el **Design System Centralizado**:

```typescript
import { Colors, Typography, Spacing } from '@/constants/theme';

// Colores
Colors.primary.DEFAULT        // #00BBDD (Cyan)
Colors.text.primary           // #F8FAFC (Blanco)
Colors.background.DEFAULT     // #0F172A (Oscuro)

// Tipografía
Typography.styles.h2          // Título grande
Typography.styles.body        // Texto normal

// Espaciado
Spacing.base                  // 16px
Spacing.lg                    // 20px
```

---

## ❌ Manejo de Errores

### Estados Posibles

```
1. Cargando
   ├─ UI: Spinner
   └─ Estado: loading = true

2. Error
   ├─ UI: Banner rojo + botón reintentar
   ├─ 401 → "Sesión expirada"
   ├─ 403 → "No tienes permiso"
   └─ 0xx → "Error de conexión"

3. Vacío
   ├─ UI: Ícono + "Sin ejercicios"
   └─ Causa: Categoría sin ejercicios

4. Éxito
   ├─ UI: Lista de ejercicios
   └─ Estado: exercises = [...]
```

---

## 🧪 Testing Rápido

### Para Testear en tu Máquina

```bash
# 1. Backend corriendo
npm run dev        # En la carpeta Backend

# 2. App corriendo
npm start          # En la carpeta Mobile

# 3. Hacer login
# → Ir a login y usar credentials de test

# 4. Navegar a Ejercicios
# → Should see spinner → then list of exercises

# 5. Click en ejercicio
# → Should navigate to detail page

# 6. Probarf errores (mock)
# → Desactivar backend → ver error banner
```

---

## 📊 Estructura de Datos

### Ejercicio (Exercise)

```json
{
  "id": "ex-001",
  "name": "Press de Banca",
  "category": "chest",
  "difficulty": "Intermedio",
  "description": "...",
  "imageUrl": "https://...",
  "instructions": ["Paso 1", "Paso 2"],
  "muscleGroups": ["Pecho", "Tríceps"],
  "equipment": ["Barra", "Banco"]
}
```

---

## ⚙️ Configuración

El hook usa la URL de API de:

```typescript
// constants/config.ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL 
  || `http://${developmentIp}:${apiPort}`;

// Por defecto: http://localhost:3000
```

Para cambiar en desarrollo:
```bash
# .env.local
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

---

## 💡 Tips

### Debugging

```typescript
// Ver qué está pasando
const { exercises, loading, error } = useExercises();

useEffect(() => {
  console.log('State:', { exercises, loading, error });
}, [exercises, loading, error]);
```

### Re-cargar Datos

```typescript
const { refetch } = useExercises();

// Botón "Reintentar"
<Pressable onPress={() => void refetch()}>
  <Text>Reintentar</Text>
</Pressable>
```

### Performance

- Búsqueda se filtra **localmente** (sin API)
- Cambio de categoría hace **nuevo request**
- No hay paginación aún (mejora futura)

---

## 🚨 Errores Comunes

### ❌ "Ejercicios no se cargan"
```
Causas posibles:
1. Backend no corriendo → Iniciar backend
2. URL mal → Verificar EXPO_PUBLIC_API_URL
3. Sin token → Hacer login
4. Token expirado → Hacer login de nuevo
```

### ❌ "Error de CORS"
```
Solución:
→ Backend debe permitir requests desde app
→ Revisar CORS headers en backend
```

### ❌ "404 Not Found"
```
Causas:
1. Ejercicio no existe → Usar ID correcto
2. Endpoint mal → Revisar ruta en backend
3. Base de datos vacía → Agregar ejercicios de prueba
```

---

## 📖 Documentación Completa

Para entender mejor, lee:

- **Implementación**: `EXERCISES_IMPLEMENTATION.md`
- **Arquitectura**: `EXERCISES_ARCHITECTURE.md`
- **Testing**: `EXERCISES_TESTING.md`
- **Backend**: `BACKEND_REQUIREMENTS.md`

---

## ✅ Checklist

- [x] Código sin errores
- [x] TypeScript tipado
- [x] Integrado con Auth
- [x] Manejo de errores
- [x] UI responsiva
- [x] Documentado

---

## 🎉 ¡Listo!

La implementación está completa. El siguiente paso es que el backend implemente los endpoints.

**Información necesaria para backend**:
- Endpoint: `GET /exercises`
- Headers: `Authorization: Bearer {token}`
- Parámetros: `?category=chest` (opcional)
- Respuesta: `{ success: true, data: Exercise[] }`

---

*Para preguntas o dudas, revisar la documentación completa o los comentarios en el código.*
