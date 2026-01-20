# Diagnóstico: Ejercicio no se guarda y se queda cargando

## Cambios Realizados

### 1. **Frontend (lib/api.ts)**
- ✅ Arreglado manejo de respuesta de la API
- ✅ Agregada validación de descripción (mínimo 10 caracteres)
- ✅ Agregada validación de URL del video
- ✅ Mejorado manejo de errores con detalles específicos

## Pasos para Diagnosticar

### Paso 1: Verifica que el Backend está ejecutándose
```bash
# En terminal backend
npm run start:dev
# Debería mostrar: NestFactory bootstrapped on port 3000
```

### Paso 2: Verifica la consola del Frontend
Cuando intentes guardar un ejercicio:
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca logs que empiezan con "📤", "📨", "✅"
4. Anota todos los mensajes de error (❌)

### Paso 3: Verifica la conectividad
En la consola del navegador, ejecuta:
```javascript
fetch('http://localhost:3000/workout/exercises', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})
.then(r => r.json())
.then(d => console.log('✅ Backend responde:', d))
.catch(e => console.error('❌ Error:', e))
```

## Problemas Comunes y Soluciones

### Problema: "Timeout: El servidor tardó demasiado"
**Causa**: El backend no está corriendo o está en localhost:3000
**Solución**:
```bash
cd backend
npm run start:dev
```

### Problema: Error 401 Unauthorized
**Causa**: El token JWT ha expirado o no se está enviando correctamente
**Solución**:
1. Cierra sesión (clic en "Cerrar sesión")
2. Vuelve a iniciar sesión
3. Intenta crear el ejercicio nuevamente

### Problema: Error 400 - Validación fallida
**Causa**: Algún campo no cumple con los requisitos
**Solución**: Revisa los logs en la consola para ver qué campo falla:
- `name`: Debe tener 3-50 caracteres
- `description`: Debe tener 10-500 caracteres
- `video`: Debe ser una URL válida (ej: https://example.com/video)
- `muscleTarget`: Al menos 1 grupo muscular
- `exerciseType`: Al menos 1 tipo de ejercicio
- `minSets`, `maxSets`, `minReps`, `maxReps`: Números positivos

### Problema: "El ejercicio debe tener al menos un tipo de ejercicio"
**Causa**: No seleccionaste un tipo de ejercicio en el paso 3
**Solución**: Vuelve al paso 3 y selecciona al menos un tipo

## Checklist de Debugging

- [ ] El backend está corriendo en `localhost:3000`
- [ ] Iniciaste sesión correctamente
- [ ] La consola del navegador NO muestra errores CORS
- [ ] El nombre tiene 3-50 caracteres
- [ ] La descripción tiene mínimo 10 caracteres
- [ ] Seleccionaste al menos 1 grupo muscular
- [ ] Seleccionaste al menos 1 tipo de ejercicio
- [ ] El video tiene una URL válida

## Logs Esperados (en orden)

```
📤 saveExercise llamado con exercise: {...}
📦 Payload preparado: {...}
📨 Haciendo POST a /workout/exercises
✅ Response del POST: {...}
✅ Ejercicio guardado en backend: {...}
```

Si los logs se detienen en algún punto, ese es el problema.

## Próximos Pasos

Si después de estos cambios el problema persiste:

1. **Revisa los logs del backend**:
   ```bash
   # Busca errores en la terminal donde corre el backend
   # Debería mostrar: POST /workout/exercises
   ```

2. **Verifica la base de datos**:
   - Confirma que PostgreSQL está corriendo
   - Verifica que la conexión DB está correcta en `.env`

3. **Reinicia todo**:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run start:dev
   
   # Terminal 2: Frontend
   cd Frontend && npm run dev
   ```
