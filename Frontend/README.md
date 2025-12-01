# Frontend - AthletIA

Aplicación web construida con **React + TypeScript + Vite + Tailwind CSS** conectada al backend de AthletIA.

## Características

- 🎨 **Tema claro/oscuro** con `ThemeProvider` y persistencia en `localStorage`
- 🔐 **Autenticación**: login con email/contraseña y Google OAuth
- 🔄 **Refresh token automático** con interceptores de Axios
- 📱 **Diseño responsivo** adaptado a móviles, tablets y escritorio
- ♿ **Accesibilidad**: labels, `aria-*`, foco visible, navegación por teclado
- ✅ **Validaciones**: `react-hook-form` + `zod` en formularios
- 🧭 **Rutas protegidas**: componentes privados accesibles solo tras login

## Estructura

```
Frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx      # Wrapper principal (sidebar + main)
│   │   │   └── Sidebar.tsx     # Barra lateral con navegación
│   │   ├── ThemeProvider.tsx   # Contexto de tema
│   │   ├── ThemeToggle.tsx     # Botón para cambiar tema
│   │   └── ProtectedRoute.tsx  # Guard de rutas privadas
│   ├── context/
│   │   └── AuthContext.tsx     # Contexto de autenticación
│   ├── lib/
│   │   └── api.ts              # Cliente Axios con interceptores
│   ├── pages/
│   │   ├── Login.tsx           # Formulario de login
│   │   ├── AuthCallback.tsx    # Callback OAuth de Google
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   └── Exercises.tsx       # Listado de ejercicios
│   ├── App.tsx                 # Configuración de rutas
│   ├── main.tsx                # Punto de entrada
│   └── index.css               # Tailwind + estilos globales
├── .env                        # Variables de entorno (no versionar)
├── .env.example                # Template de .env
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Instalación

```powershell
cd Frontend
npm install
```

## Configuración

Copia `.env.example` a `.env` y ajusta las URLs si es necesario:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_AUTH_URL=http://localhost:3000/auth/google
```

## Ejecutar

```powershell
npm run dev
```

La aplicación se abre en **http://localhost:5173**

## Flujo de autenticación

1. **Login con email/clave**: POST `/auth/login` → guarda `accessToken` y `refreshToken` en `localStorage`.
2. **Login con Google**: redirige a `/auth/google` → backend retorna tokens en el fragmento URL → callback extrae y guarda tokens.
3. **Refresh automático**: si el `accessToken` expira (401), el interceptor llama a `/auth/refresh-token` y reintenta la petición.
4. **Logout**: POST `/auth/logout` → limpia tokens del almacenamiento.

## Rutas

- `/login` - Página de inicio de sesión
- `/auth/callback` - Callback de Google OAuth
- `/dashboard` - Dashboard principal (protegida)
- `/exercises` - Listado de ejercicios (protegida)

## Scripts

- `npm run dev` - Desarrollo con hot-reload
- `npm run build` - Build optimizado para producción
- `npm run preview` - Previsualiza el build en puerto 4173

## Validación de formularios

Ejemplo en `Login.tsx`:

```tsx
const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
```

Los errores se muestran debajo de cada campo con `aria-describedby` y `role="alert"`.

## Accesibilidad

- Todas las etiquetas de formulario usan `<label htmlFor>`.
- Botones y enlaces con `aria-label` descriptivo.
- `:focus-visible` reforzado en `index.css`.
- Navegación por teclado: todos los controles son focusables.

## Tema claro/oscuro

Se gestiona con la clase `dark` en `<html>`. El usuario puede alternar con el botón en la barra lateral (persiste en `localStorage`).

## Conexión con el backend

Asegúrate de que el backend esté corriendo en `http://localhost:3000` (o la URL configurada en `.env`).

```powershell
cd ../backend
npm run start:dev
```

## Notas

- Los tokens se guardan en `localStorage` (considera `httpOnly` cookies en producción).
- El diseño sigue el estilo de la UI proporcionada (Tailwind, Material Symbols, paleta primary `#13a4ec`).
- Responsive: grid adapta columnas según tamaño de pantalla (`md:`, `lg:`).
