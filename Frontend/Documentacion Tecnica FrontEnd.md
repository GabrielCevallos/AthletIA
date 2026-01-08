# Documentación Técnica AthletIA

## 1. Descripción del Diseño de la Interfaz

### 1.1. Estructura de la Aplicación

#### Arquitectura general:

- **Patrón de arquitectura**: Aplicación SPA (Single Page Application) basada en componentes React
- **Enrutamiento**: React Router DOM v6 con rutas protegidas
- **Gestión de estados**: React Context API (AuthContext, AccessibilityContext)
- **Cliente HTTP**: Axios con interceptores para manejo de tokens

#### Estructura de carpetas:

```
Frontend/src/
├── components/          # Componentes reutilizables
│   ├── layout/          # Layout principal (Sidebar, Layout)
│   ├── Users/           # Componentes específicos de usuarios
│   └── [otros]          # ThemeProvider, ProtectedRoute, etc.
├── context/             # Contextos de React (Auth, Accessibility)
├── lib/                 # Utilidades y configuración (api.ts, stores)
├── pages/               # Páginas/vistas de la aplicación
│   ├── Exercises/       # Módulo de ejercicios
│   └── Routines/        # Módulo de rutinas
└── App.tsx              # Configuración de rutas principal
```

#### Componentes principales:

- **Layout**: Wrapper principal que incluye Sidebar y área de contenido.
- **Sidebar**: Navegación lateral responsiva con menú hamburguesa en móvil.
- **ProtectedRoute**: Guard que protege rutas privadas verificando autenticación.
- **ThemeProvider/ThemeToggle**: Sistema de tema claro/oscuro.
- **AccessibilityButton**: Botón flotante para opciones de accesibilidad.

### 1.2. Estilos y Sistema de Diseño

#### Framework CSS: Tailwind CSS v3.4.15

#### Paleta de colores definida:

```js
colors: {
  primary: '#13a4ec',          // Azul principal
  'background-light': '#f6f7f8', // Fondo claro
  'background-dark': '#101c22',  // Fondo oscuro
}
```

#### Modo oscuro: Implementado con class strategy de Tailwind

- Persistencia en localStorage
- Detecta preferencia del sistema al primer render
- Toggle manual disponible

#### Tipografía:

- **Fuente principal**: Inter (sans-serif)
- **Escalado responsivo**: 95% en móviles, 100% por defecto, 105% en pantallas grandes (>1920px)

#### Espaciado y diseño responsivo:

- Mobile-first approach
- **Breakpoints de Tailwind**: sm (640px), md (786px), lg (1024px), xl (1280px)
- Sidebar colapsa en móvil con menú hamburguesa
- **Padding adaptativo**: 4(movil) -> 6(tablet) -> 10(desktop)

### 1.3. Dependencias Principales

#### Producción:

- **react** v19.2.0 y **react-dom** – Framework UI
- **react-router-dom** v6.28.0 – Enrutamiento
- **axios** v1.7.9 – Cliente HTTP
- **react-hook-form** v7.52.1 – Manejo de formularios
- **zod** v3.23.8 – Validación de esquemas
- **@hookform/resolvers** – Integración Zod + React Hook Form
- **lucide-react** v0.556.0 – Iconos
- **sweetalert2** v11.14.5 – Alertas/modales

#### Desarrollo:

- **vite** v7.2.4 – Bundler y dev server
- **typescript** v5.9.3 – Tipado estático
- **tailwindcss** v3.4.15 – Framework CSS
- **@tailwindcss/forms** – Estilos para formularios
- **@tailwindcss/container-queries** – Container queries

---

## 2. Estándares de Diseño Aplicados

### 2.1. Nomenclatura CSS

#### Convenciones Tailwind:

- Utility-first approach
- Clases descriptivas inline: `bg-white dark:bg-[#111c22]`
- Prefijos para variants: `dark:`, `hover:`, `focus:`
- Colores custom con valores hexadecimales: `dark:bg-[#1a2831]`

### 2.2. Estructura de Componentes

#### Organización:

- Componentes funcionales con hooks
- Un componente por archivo
- Export default al final
- Props tipadas con TypeScript

#### Separación de concerns:

- Lógica de negocio en contextos/hooks
- Componentes de presentación en `/components`
- Páginas completas en `/pages`
- Utilidades en `/lib`

### 2.3. Accesibilidad (WCAG 2.1 Level AA)

#### Implementaciones:

- Labels en todos los inputs
- Atributos ARIA
- Focus visible con outline personalizado
- Navegación por teclado
- Contraste de colores adecuado
- Roles semánticos
- Soporte para lectores en pantalla

#### Funciones de accesibilidad avanzadas implementadas:

- Tamaños de letra
- Escala de grises
- Alto contraste
- Contraste negativo
- Fuente legible
- Enlaces subrayados
- Lectura de página

---

## 3. Instrucciones para Ejecutar Localmente

### 3.1. Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0

### 3.2. Instalación

#### 3.2.1. Navegar al directorio del frontend

```bash
cd Frontend
```

#### 3.2.2. Instalar dependencias

```bash
npm install
```

### 3.3. Configuración

#### 3.3.1. Copiar archivos de ejemplo

```bash
cp .env.example .env
```

**(Nota: En Windows usar `copy .env.example .env`)**

#### 3.3.2. Editar .env con las URLs correctas

**Nota**: Si el Backend corre en un puerto diferente, actualiza `VITE_API_URL`

### 3.4. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

- La aplicación se abrirá en https://localhost:5173
- Hot-reload activado (cambios se reflejan automáticamente)

### 3.5. Conectar con el Backend

#### Paso 1: Asegúrate de que el Backend esté corriendo

```bash
cd Backend
npm run start:dev
```

#### Paso 2: Verifica la conexión

- Backend debe estar en http://localhost:3000
- Frontend debe tener `VITE_API_URL=http://localhost:3000` en .env

#### Paso 3: Probar autenticación

- Ve a https://localhost:5173/login
- Intenta loguear con credenciales o Google OAuth

---

## 4. Capturas de aplicación funcional

- **Login**
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/ed50b4bb-a411-4588-bb5c-578d57cd208f" />

- **Autenticación con Google**
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/1b4e8268-85ea-4247-bc4d-d37205bf03d2" />

- **Pantalla de Ejercicios aplicando tema claro**
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/fa6ff91c-d489-47a1-80ac-6049ee96c380" />

- **Creación de rutina para visualización de alerta**
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/62684e75-04d0-43f3-90af-e97dbe8a0102" />

- **Eliminación de rutina para visualización de alerta**
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/56aa2932-fb3b-4f62-b759-5e6c9906631e" />
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/ae5623e9-08d5-4def-be6a-a321e071f003" />


### Menú de Accesibilidad
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/4bbf4842-4a89-40a8-967d-628509d7c3de" />

- Escala de Grises
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/e97bed29-9009-4d11-985c-d50686f30a70" />

- Contraste negativo
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/41aee47a-1128-4c79-a8c2-f63345aaf51e" />

- Fuente Legible
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/442a27b0-d2d4-4f77-a898-96790efe9e3f" />

- Enlaces Subrayados
<img width="719" height="404" alt="image" src="https://github.com/user-attachments/assets/628e5044-8b2c-4dff-8ef6-a3512164ba11" />

