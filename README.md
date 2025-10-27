# AthletIA

<img width="300" height="300" alt="image" src="https://github.com/user-attachments/assets/2f025a77-a037-4fec-9d6b-e14a308cb553" style="border-radius: 50%;" />

## 📋 Tabla de Contenidos

- [📋 Requisitos Funcionales - Prioridad Alta](#-requisitos-funcionales---prioridad-alta)
  - [🔑 RF1: Autenticación y Gestión de Usuarios](#-rf1-autenticación-y-gestión-de-usuarios)
  - [🏋️ RF2: Gestión de Contenido de Entrenamiento](#️-rf2-gestión-de-contenido-de-entrenamiento-splits-rutinas-y-ejercicios)
  - [👤 RF3: Vista de Usuarios - Seguimiento de Entrenamientos](#-rf3-vista-de-usuarios---seguimiento-de-entrenamientos)
  - [📊 RF4: Estadísticas y Progreso](#-rf4-estadísticas-y-progreso)
  - [🤖 RF5: Integración con Asistente Virtual de IA](#-rf5-integración-con-asistente-virtual-de-ia)
  - [📱 RF6: Soporte Multiplataforma y Dispositivos](#-rf6-soporte-multiplataforma-y-dispositivos)
  - [🔔 RF7: Funcionalidades Generales](#-rf7-funcionalidades-generales)
- [🛠️ Requisitos No Funcionales - Prioridad Media](#️-requisitos-no-funcionales---prioridad-media)
  - [⚡ RNF1: Rendimiento y Escalabilidad](#-rnf1-rendimiento-y-escalabilidad)
  - [🔒 RNF2: Seguridad y Privacidad](#-rnf2-seguridad-y-privacidad)
  - [🎨 RNF3: Usabilidad y Accesibilidad](#-rnf3-usabilidad-y-accesibilidad)
  - [🧩 RNF4: Mantenibilidad y Desarrollo](#-rnf4-mantenibilidad-y-desarrollo)
  - [🔗 RNF5: Integración y Compatibilidad](#-rnf5-integración-y-compatibilidad)
  - [☁️ RNF6: Confiabilidad y Recuperación](#️-rnf6-confiabilidad-y-recuperación)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-seleccionada-del-proyecto)
  - [Nivel 1: Contexto](#nivel-1--contexto)
  - [Nivel 2: Contenedor](#nivel-2-contenedor)
- [✍️ Estándares de Codificación](#️-estándares-de-codificación-para-el-proyecto)
  - [Backend (Node.js + TypeScript)](#backend-nodejs--typescript)
  - [Base de Datos](#base-de-datos)
  - [Buenas Prácticas Generales](#buenas-prácticas-generales)
- [🌳 Flujo de Trabajo (GitFlow)](#-flujo-de-trabajo-gitflow)
- [🚀 Pasos para Ejecutar](#-pasos-para-ejecutar)
- [🧪 Comandos Útiles](#-comandos-útiles)
- [🌐 Acceso a la Aplicación](#-acceso-a-la-aplicación)
- [Mini Dossier](#-mini-dossier)
  - [Introducción](#introducción)
  - [Endpoints Desarrollados](#endpoints-desarrollados)
  - [Pruebas Realizadas en Postman](#pruebas-realizadas-en-postman)
- [🔐 Implementación de Seguridad](#-implementación-de-seguridad)
  - [Autenticación y Autorización con JWT/OAuth2](#autenticación-y-autorización-con-jwtoauth2)
---

# 📋 Requisitos Funcionales - Prioridad Alta

## 🔑 RF1: Autenticación y Gestión de Usuarios
- **RF1.1:** La aplicación debe permitir a los usuarios registrarse mediante: nombre, apellido, correo electrónico, número de teléfono, contraseña o integración con redes sociales, como Google.  
- **RF1.2:** Los usuarios deben poder iniciar sesión con credenciales seguras y recuperar contraseñas olvidadas.  
- **RF1.3:** La vista de administradores debe incluir un CRUD completo para gestionar usuarios: crear nuevos perfiles, leer/listar usuarios existentes (con filtros por nombre, fecha de registro), actualizar datos de usuarios (como perfil y preferencias) y eliminar cuentas inactivas o problemáticas.  
- **RF1.4:** La aplicación debe soportar roles de usuario: usuario estándar, y administrador, con accesos diferenciados, en los que el usuario estándar no puede acceder a endpoints admin, mientras que, el administrador tiene el papel de moderación y visibilidad.  

## 🏋️ RF2: Gestión de Contenido de Entrenamiento (Splits, Rutinas y Ejercicios)
- **RF2.1:** La vista de administradores debe incluir un CRUD completo para splits (distribución semanal de entrenamientos): crear splits personalizados, leer/listar splits existentes (con scroll infinito), actualizar detalles (como días de la semana, duración) y eliminar splits obsoletos.  
- **RF2.2:** La aplicación deberá incluir un CRUD para rutinas: crear rutinas compuestas por ejercicios, listar con scroll infinito, actualizar, es decir, agregar/quitar ejercicios y eliminar.  
- **RF2.3:** La vista de administradores debe incluir un CRUD para ejercicios: crear ejercicios con descripciones, videos demostrativos o imágenes, listar con scroll infinito, actualizar y eliminar.  
- **RF2.4:** La aplicación deberá permitir a los administradores asociar ejercicios a rutinas y rutinas a splits, permitiendo una estructura jerárquica para personalización.  

## 👤 RF3: Vista de Usuarios - Seguimiento de Entrenamientos
- **RF3.1:** Los usuarios deben poder seguir splits semanales predefinidos o crear distribuciones semanales personalizadas.  
- **RF3.2:** La aplicación debe permitir a los usuarios registrar repeticiones realizadas y pesos levantados en cada ejercicio (de manera opcional, es decir, si el usuario desea).  
- **RF3.3:** Los usuarios deben poder ver y navegar por listas de ejercicios, rutinas y splits con scroll infinito para manejar grandes catálogos.  

## 📊 RF4: Estadísticas y Progreso
- **RF4.1:** La aplicación debe generar y mostrar estadísticas gráficas de progreso: gráficos de línea para evolución de medidas corporales y pesos levantados.  
- **RF4.2:** Los usuarios deben poder filtrar estadísticas por período (día, semana, mes).  
- **RF4.3:** La aplicación debe calcular métricas automáticas basadas en datos ingresados, como el el IMC (Índice de Masa Corporal).  

## 🤖 RF5: Integración con Asistente Virtual de IA
- **RF5.1:** La aplicación debe incluir un asistente de IA que responda consultas sobre entrenamiento mediante chat.  
- **RF5.2:** El asistente debe proporcionar consejos personalizados basados en datos del usuario.  

## 📱 RF6: Soporte Multiplataforma y Dispositivos
- **RF6.1:** La aplicación debe funcionar en Android y web app para ordenadores, con interfaces responsivas adaptables a los diferentes tamaños de pantalla.  

## 🔔 RF7: Funcionalidades Generales
- **RF7.1:** La aplicación debe enviar notificaciones push para recordatorios de entrenamientos, progreso semanal o consejos de IA.  

---

## 🛠️ Requisitos No Funcionales - Prioridad Media

## ⚡ RNF1: Rendimiento y Escalabilidad
- **RNF1.1:** La aplicación debe cargar listas con scroll infinito en menos de 2 segundos por página adicional, soportando hasta 100 elementos sin degradación notable.  
- **RNF1.2:** El sistema debe escalar para al menos 1.000 usuarios concurrentes, utilizando bases de datos cloud (ej. Firebase) para manejar crecimiento. (Se deberían hacer pruebas de carga)  

## 🔒 RNF2: Seguridad y Privacidad
- **RNF2.1:** Autenticación debe usar tokens JWT o similares, con verificación de dos factores opcional.  
- **RNF2.2:** Protección contra accesos no autorizados: logs de auditoría para acciones de administradores y detección de intentos de intrusión.  

## 🎨 RNF3: Usabilidad y Accesibilidad
- **RNF3.1:** La interfaz debe ser intuitiva, con navegación basada en menús y búsqueda por texto para elementos como ejercicios, rutinas y splits.  
- **RNF3.2:** Soporte para múltiples idiomas (al menos español e inglés) y temas oscuro/claro.  
- **RNF3.3:** Cumplir con estándares de accesibilidad WCAG 2.1: soporte para lectores de pantalla, alto contraste y navegación por teclado.  

## 🧩 RNF4: Mantenibilidad y Desarrollo
- **RNF4.1:** El código debe ser modular, utilizando frameworks multiplataforma como Flutter o React Native para minimizar duplicación en Android y web.  
- **RNF4.2:** Integración continua (CI/CD) para despliegues automáticos, considerando un equipo de 3 desarrolladores.  
- **RNF4.3:** Documentación interna: cada módulo (ej. CRUD) debe tener comentarios y tests unitarios con cobertura mayor al 80%.  

## 🔗 RNF5: Integración y Compatibilidad
- **RNF5.1:** La IA debe integrarse vía APIs como OpenAI o similar, con latencia de respuesta menor a 3 segundos.  
- **RNF5.2:** Compatibilidad con versiones mínimas: Android 8+, navegadores modernos como Chrome y Safari.  

## ☁️ RNF6: Confiabilidad y Recuperación
- **RNF6.1:** La aplicación debe tener una disponibilidad del 99.9%, con backups automáticos diarios de datos.  
- **RNF6.2:** Manejo de errores: mensajes amigables para fallos (por ejemplo: "No hay conexión") y recuperación automática de sesiones interrumpidas.  

---

## 🏗️ Arquitectura seleccionada del proyecto

### Nivel 1: Contexto

<img width="800" height="800" alt="ModeloC4Context drawio" src="https://github.com/user-attachments/assets/8e1271eb-f30d-46a8-bfb5-b052ac35ee34" />

*   👥 **Actores principales**:
    *   **Usuario**: Interactúa con la aplicación móvil (React Native) y web (React).
*   🌐 **Sistema central**: La **aplicación de fitness** que ofrece generación de rutinas y seguimiento de progreso.
*   🔗 **Integraciones externas**:
    *   Servicios de **IA** para generar rutinas personalizadas.
    *   APIs externas (por ejemplo, de datos de salud o terceros servicios de autenticación).

**📝 Resumen del nivel de contexto:**
La arquitectura es **cliente-servidor con servicios externos** y un backend centralizado que expone APIs REST para ambos clientes.

### Nivel 2: Contenedor

<img width="800" height="800" alt="image" src="https://github.com/user-attachments/assets/418fedd0-6c7d-4361-a134-0164db5521cf" />

*   📱💻 **Frontend Web y Móvil**:
    *   Ambos construidos con **React/React Native**.
    *   Se comunican mediante **REST APIs** con el backend.
*   ⚙️ **Backend**:
    *   Basado en **Node.js con TypeScript**.
    *   Exposición de **REST endpoints** para operaciones de clientes y administradores.
*   🤖 **Servicio de IA**:
    *   Implementado en **Python (FastAPI)**.
    *   Encargado de lógica de generación de rutinas.
*   🗄️ **Base de datos**:
    *   Se asume **PostgreSQL** para persistencia de usuarios, rutinas y métricas.
*   🔄 **Comunicación**:
    *   Frontend ↔ Backend: REST/JSON.
    *   Backend ↔ Servicio IA: REST/JSON.
    *   Backend ↔ Base de datos: SQL mediante un ORM (posiblemente TypeORM).

**📝 Resumen del nivel de contenedor:**
La arquitectura es **modular**, basada en contenedores lógicos, con separación clara de responsabilidades: frontend, backend, IA y base de datos. Esto facilita escalabilidad, mantenimiento y pruebas independientes.

### Nivel 3: Componente

<img width="800" height="800" alt="image" src="https://github.com/user-attachments/assets/2b086111-5c2d-4a3c-ba71-7ceee30c2d04" />

*   👤 **Actores del sistema**:
    *   **Administrador (Persona)**: Control total sobre la plataforma, gestiona usuarios, configura parámetros del sistema y accede a todas las funcionalidades.
    *   **Moderador (Persona)**: Permisos limitados, puede gestionar usuarios comunes pero no modificar parámetros críticos del sistema.
    *   **Usuario (Persona)**: Accede a la aplicación para gestionar y registrar sus rutinas de entrenamiento.

*   🌐 **Aplicación AthleteIA**:
    *   **Aplicación Web (Frontend Web - React)**: Componente frontend para que el usuario interactúe desde navegadores web.
    *   **Aplicación Móvil (Frontend Movil - React Native)**: Aplicación nativa Android para usuarios en dispositivos móviles.
    *   Ambas aplicaciones consumen **APIs REST/JSON** del backend.

*   ⚙️ **Backend - Componentes principales**:
    
    *   **Controladores (Express)**: 
        *   Reciben la petición, validan entradas.
        *   Delegan la lógica de negocio a uno o más servicios.
        *   Actúan en conjunto con las capas de autenticación y autorización.
    
    *   **Capa de Autenticación (Middleware de Autenticación)**:
        *   Intercepta peticiones HTTP entrantes.
        *   Identifica usuarios según su usuario en el sistema.
        *   Actúa en conjunto con la capa de autorización.
    
    *   **Capa de Autorización (Middleware de Autorización)**:
        *   Intercepta peticiones HTTP entrantes.
        *   Verifica que el usuario tenga acceso a los recursos del sistema.
    
    *   **Servicios (Services)**:
        *   Ejecuta la lógica de negocio y la interacción con otras capas.
        *   Utiliza los **Repositorios** para el manejo de datos.
        *   Envía **correos transaccionales** a través del Servicio de Correo Electrónico.
        *   Solicita **recomendaciones** al Asistente IA.
    
    *   **Repositorios (TypeORM Repository)**:
        *   Se comunican con la **Base de Datos** para realizar operaciones CRUD.
        *   Utilizan para el modelo de datos.

*   🗄️ **Base de Datos (Sistema PostgreSQL)**:
    *   Almacena información de usuarios, rutinas y métricas.
    *   Lee y escribe datos según las operaciones solicitadas por los repositorios.

*   🤖 **Asistente IA (Externo - Python FastAPI)**:
    *   Proporciona recomendaciones inteligentes y personalización de rutinas.
    *   Utilizado por los servicios del backend.

*   📧 **Servicio de Correo Electrónico (Software System)**:
    *   Sistema externo encargado de enviar correos electrónicos.
    *   Notifica a los usuarios sobre eventos importantes.

*   🔌 **APIs Externas (Externo - APIs De Google)**:
    *   APIs de inteligencia artificial utilizadas por el Asistente IA.

*   🔄 **Flujo de comunicación**:
    *   Usuario → Aplicación Web/Móvil → Controladores → Servicios → Repositorios → Base de Datos
    *   Servicios → Asistente IA → APIs Externas
    *   Servicios → Servicio de Correo Electrónico

**📝 Resumen del nivel de componente:**

La arquitectura a nivel de componente muestra una **separación clara de responsabilidades** siguiendo el patrón **CSR (Controller-Service-Repository)** y principios de **arquitectura en capas**. Los controladores manejan las peticiones HTTP, las capas de middleware gestionan la seguridad (autenticación/autorización), los servicios implementan la lógica de negocio, y los repositorios abstraen el acceso a datos. Esta estructura facilita el **mantenimiento**, **testing** y **escalabilidad** del sistema, permitiendo modificar componentes individuales sin afectar el resto de la aplicación.

---

## ✍️ Estándares de codificación para el proyecto

### Backend (Node.js + TypeScript)

*   ✅ **Uso de TypeScript estrictamente tipado** (`strict: true`) para evitar errores en tiempo de compilación y mejorar la robustez del código.
*   🧩 **Separación en capas o módulos** para mantener una estructura clara y la separación de responsabilidades:
    *   **Controladores**: Encargados de recibir las solicitudes (requests) y delegar la lógica de negocio.
    *   **Servicios**: Contienen la lógica de negocio principal de la aplicación.
    *   **Repositorios**: Gestionan el acceso y la manipulación de datos en la base de datos.
*   🔡 **Nombres camelCase** para variables y funciones, y **PascalCase** para clases, interfaces y tipos.
*   🚫 **Manejo de errores centralizado** utilizando middleware (con NestJS) para ofrecer respuestas consistentes y amigables.
*   ⚡ **Uso de promesas/async-await** para todas las operaciones asincrónicas, mejorando la legibilidad y el manejo de flujos de control.

### Base de datos

*   🐍 **Convenciones de nombres: snake_case para tablas y columnas** (ej. `nombre_usuario`, `fecha_registro`).
*   🔑 **Llaves primarias**: Utilizar `id` autoincrementales como identificador único para cada tabla.
*   📊 **Implementación de índices** en columnas críticas.

### Buenas prácticas generales

*   🌳 **Uso de Git flow** para la gestión del control de versiones, incluyendo ramas `main` (producción), `develop` (desarrollo) y `feature branches` (para nuevas funcionalidades).
*   💬 **Commits claros y atómicos**, con mensajes descriptivos.
*   🛡️ **Validación de datos en frontend y backend** para garantizar la integridad y seguridad de la información.
*   🪵 **Logging centralizado y manejo de errores** consistente en toda la aplicación para facilitar la depuración y el monitoreo.
*   🧪 **Implementación de tests unitarios y de integración** desde el inicio del proyecto, con una cobertura de código mayor al 80% para los módulos críticos.

---

# 🌳 Flujo de Trabajo (GitFlow)

## 🔹 Ramas Principales
- **main / master** → Código en producción (releases estables).  
- **develop** → Integración de características nuevas (próximo release).  

## 🔹 Ramas Temporales
- **feature/** → Para nuevas funcionalidades.  
  *(se crean desde `develop` → se mergean de nuevo a `develop`)*  
- **release/** → Preparación de releases.  
  *(se crean desde `develop` → se mergean a `main` y `develop`)*  
- **hotfix/** → Correcciones urgentes en producción.  
  *(se crean desde `main` → se mergean a `main` y `develop`)*  

## 🔹 Flujo Básico de Trabajo
1. 🚧 Desarrolla en `feature/nueva-funcion` partiendo de `develop`.  
2. 🔀 Haz **merge a `develop`** cuando la feature esté lista.  
3. 🧪 Crea `release/v1.0` desde `develop` para pruebas finales.  
4. ✅ Haz **merge a `main`**, crea un **tag** (ej. `v1.0`) y mergea de vuelta a `develop`.  
5. 🐞 Para bugs críticos: crea rama `hotfix/` desde `main`, y mergea a **main** y **develop**.  

---

## 🚀 Pasos para Ejecutar

### 1. Clonar el repositorio
```bash
git clone https://github.com/GabrielCevallos/AthletIA
```

### 2. Entrar al proyecto
```bash
cd Athletia/athletia
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Ejecutar en modo desarrollo
```bash
npm run start:dev
```

### 5. Ejecutar en modo producción
```bash
npm run start:prod
```

---

## 🧪 Comandos Útiles

### 🧹 Lint
```bash
npm run lint
```

### 🧱 Compilar
```bash
npm run build
```

### 🧾 Tests
```bash
npm run test
```

---

## 🌐 Acceso a la Aplicación

👉 **http://localhost:3000**

> ⚠️ **Nota:** Si el puerto cambia, revisa el archivo `src/main.ts` o `.env`

# 📃Mini Dossier

## Introducción

AthletIA es una API RESTful diseñada para la gestión integral de usuarios y rutinas de entrenamiento. Su propósito es ofrecer un conjunto completo de operaciones **CRUD (Crear, Leer, Actualizar, Eliminar)** para facilitar la integración de funcionalidades de fitness en cualquier tipo de aplicación de software.

La API está estructurada en módulos, cada uno con responsabilidades específicas, desde la autenticación y gestión de cuentas hasta la administración de perfiles y ejercicios.

---

## Endpoints Desarrollados

A continuación se detallan los endpoints implementados, agrupados por funcionalidad.

### 🔑 AUTH

Este módulo gestiona la autenticación, registro y seguridad de las cuentas.

| Ruta | Método | Descripción | Parámetros | Códigos de Respuesta |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | Autentica credenciales y emite un token JWT. | **Body:** `email` (string), `password` (string) | `200`, `400`, `401`, `500` |
| `/auth/register-account` | `POST` | Registra una nueva cuenta de usuario. | **Body:** `email` (string), `password` (string) | `201`, `400`, `500` |
| `/auth/complete-profile-setup` | `POST` | Completa la configuración del perfil del usuario tras el registro. | **Body:** `accountId` (string), `profileRequest` (object) | `201`, `400`, `500` |
| `/auth/change-password` | `PATCH` | Permite a un usuario autenticado cambiar su contraseña. | **Body:** `accountId`, `oldPassword`, `newPassword` | `200`, `400`, `401`, `404`, `500` |
| `/auth/refresh-token` | `POST` | Genera un nuevo token de acceso usando un token de refresco. | **Body:** `refreshToken` (string) | `200`, `400`, `500` |
| `/auth/logout` | `POST` | Cierra la sesión del usuario invalidando su token de refresco. | **Body:** `accountId` (string) | `200`, `401`, `500` |

---

### 👤 ACCOUNT

Endpoints dedicados a la administración de cuentas de usuario. Requieren roles específicos.

| Ruta | Método | Descripción | Parámetros | Códigos de Respuesta |
| :--- | :--- | :--- | :--- | :--- |
| `/users` | `GET` | Obtiene una lista paginada de usuarios. **Rol requerido: ADMIN o MODERATOR**. | **Query:** `page`, `limit`, `search` | `200`, `403`, `500` |
| `/users/:id` | `GET` | Obtiene la información detallada de un usuario. **Rol requerido: ADMIN o MODERATOR**. | **URL:** `id` del usuario | `200`, `401`, `403`, `404`, `500` |
| `/users/:id/suspend` | `PATCH` | Suspende la cuenta de un usuario. **Rol requerido: ADMIN o MODERATOR**. | **URL:** `id` del usuario | `200`, `401`, `403`, `404`, `500` |
| `/users/:id/give-role` | `PATCH` | Asigna o cambia el rol de un usuario. **Rol requerido: ADMIN**. | **URL:** `id` del usuario, **Body:** `role` | `200`, `400`, `401`, `403`, `404`, `500` |

---

### 📄 PROFILES

Módulo para la gestión de los perfiles públicos y privados de los usuarios.

| Ruta | Método | Descripción | Parámetros | Códigos de Respuesta |
| :--- | :--- | :--- | :--- | :--- |
| `/profiles/:id` | `GET` | Obtiene la información detallada de un perfil. **Requiere autenticación**. | **URL:** `id` del perfil | `200`, `401`, `404`, `500` |
| `/profiles/:id` | `PATCH` | Actualiza la información de un perfil. Un usuario solo puede actualizar su propio perfil (a menos que sea ADMIN). | **URL:** `id` del perfil, **Body:** campos a actualizar | `200`, `400`, `401`, `403`, `404`, `500` |

---

### 💪 EXERCISES

Endpoints para la gestión de los ejercicios de entrenamiento.

| Ruta | Método | Descripción | Parámetros | Códigos de Respuesta |
| :--- | :--- | :--- | :--- | :--- |
| `/workout/exercises` | `POST` | Crea un nuevo ejercicio. | **Body:** datos del ejercicio | `201`, `400`, `500` |
| `/workout/exercises` | `GET` | Obtiene una lista de todos los ejercicios. | Ninguno | `200`, `500` |
| `/workout/exercises/:id` | `GET` | Obtiene la información detallada de un ejercicio. | **URL:** `id` del ejercicio | `200`, `404`, `500` |
| `/workout/exercises/:id` | `PATCH` | Actualiza parcialmente un ejercicio existente. | **URL:** `id` del ejercicio, **Body:** campos a actualizar | `200`, `400`, `404`, `500` |
| `/workout/exercises/:id` | `DELETE` | Elimina un ejercicio de forma permanente. | **URL:** `id` del ejercicio | `204`, `404`, `500` |

---

## Pruebas Realizadas en Postman

Para garantizar el correcto funcionamiento de la API, se realizaron pruebas exhaustivas en cada uno de los endpoints utilizando **Postman**. Las pruebas cubrieron:

- **Peticiones exitosas (Happy Paths):** Verificación de respuestas con código `200` y `201`, asegurando que los datos se creen, lean, actualicen y eliminen correctamente.
- **Errores de cliente:** Comprobación de respuestas `400` (Bad Request), `401` (Unauthorized), `403` (Forbidden) y `404` (Not Found) al enviar datos incorrectos o sin los permisos adecuados.
- **Validación de datos:** Pruebas para asegurar que los datos de entrada son validados correctamente antes de ser procesados.

A continuación, se muestran algunas capturas de pantalla de las pruebas ejecutadas:

<img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/16596bc9-662a-4a45-951c-b638d61aec2b" />  <img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/5a67c3b3-04ae-4f21-9b6f-c0ded3c09624" />

<img width="487" height="274" alt="image" src="https://github.com/user-attachments/assets/93f8a6d8-2a48-4867-b647-ec94bc019161" />  <img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/14da3f38-0ff3-48a5-8bb8-a70508c88754" />

<img width="487" height="274" alt="image" src="https://github.com/user-attachments/assets/bc81f264-2dde-4ba7-86a5-dd55cdd88b84" />  <img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/8b8e1aca-58bc-4677-a131-cfe337d295df" />

<img width="487" height="274" alt="image" src="https://github.com/user-attachments/assets/22a3441d-0a1b-4c26-951f-0079ca373576" />  <img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/41175fd3-db0a-4832-be38-8a66814b8fbe" />

<img width="480" height="270" alt="image" src="https://github.com/user-attachments/assets/dab61523-222b-40d9-ac4a-61d71b937bf2" />  <img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/a537840f-2072-4d05-a33e-8e0d50b65b18" />

<img width="487" height="274" alt="image" src="https://github.com/user-attachments/assets/b713ae10-b56f-4e1e-919c-6f364d3849fc" />  <img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/d0b8c213-9a49-4b2d-b866-8bb137428db5" />

<img width="487" height="274" alt="image" src="https://github.com/user-attachments/assets/f5f89b80-f39f-4bb2-bf5e-10b9b22ae3ad" />  <img width="486" height="274" alt="image" src="https://github.com/user-attachments/assets/f26b8e69-37b4-417a-bd28-9b342912c012" />

<img width="487" height="274" alt="image" src="https://github.com/user-attachments/assets/5e1431ff-d67c-474f-a474-9329696f9d70" />

# 🔐 Implementación de Seguridad

## Autenticación y Autorización con JWT/OAuth2

Esta sección documenta la implementación de seguridad en el backend, incluyendo autenticación JWT, validaciones, CORS y buenas prácticas según OWASP.

---

## 1. 🛠️ Configuración de Entorno

### Instalar dependencias necesarias para la seguridad

**JWT (JSON Web Tokens)**

<img width="886" height="354" alt="image" src="https://github.com/user-attachments/assets/b1d36ac9-3239-465c-b26a-a41a812042c0" />

**CORS (Cross-Origin Resource Sharing)**

<img width="886" height="358" alt="image" src="https://github.com/user-attachments/assets/f0ee7643-9165-4fb1-9eae-9d7abf507893" />

**Argon2 (Hash de Contraseñas)**

<img width="886" height="356" alt="image" src="https://github.com/user-attachments/assets/74ef2d6a-9934-40dd-9930-fbf5a0da682e" />

> Se utilizó Argon2 en lugar de Bcrypt por su mayor seguridad y resistencia a ataques.


### Variables de Entorno

<img width="886" height="375" alt="image" src="https://github.com/user-attachments/assets/fc9a10a5-0845-4dfa-bdb1-2862aae824f5" />


Se creó un archivo `.env` (no versionado) con las siguientes claves secretas:

---

## 2. 🔑 Implementación del Flujo JWT

### Rutas de Autenticación

**Login (`/auth/login`)**

<img width="886" height="296" alt="image" src="https://github.com/user-attachments/assets/44cd4cd4-b39b-4507-b8d5-fc2772e7106e" />


**Registro (`/auth/register-account`)**

<img width="886" height="319" alt="image" src="https://github.com/user-attachments/assets/597f249b-d9ab-4d3f-9f14-6bf90ff1ca2a" />


### Generación de Token JWT
                        Generacion Token JWT dentro de Auth.module
<img width="886" height="327" alt="image" src="https://github.com/user-attachments/assets/bb390ab0-c923-4e8f-921f-2d28c4bb4480" />
<img width="886" height="344" alt="image" src="https://github.com/user-attachments/assets/02a4d103-e739-467c-80b4-315a5046f360" />



**Definicion de iat del token JWT**

<img width="886" height="338" alt="image" src="https://github.com/user-attachments/assets/de32dab5-6573-4014-ac65-c3de15fc7f85" />


**Definicion exp del JWT**

<img width="886" height="265" alt="image" src="https://github.com/user-attachments/assets/3e078549-d7ee-4442-be76-f2e0783db6dc" />


**JWTPayload con Roles de Usuario**

<img width="886" height="315" alt="image" src="https://github.com/user-attachments/assets/31751f59-d19f-4246-b912-2c917cdb75a6" />


### Middleware de Verificación

**Middleware de Verificacion de Token**

<img width="886" height="842" alt="image" src="https://github.com/user-attachments/assets/bc49a580-e1ec-4b12-bb58-d69659b38fe1" />


---

## 3. 🛡️ Control de Acceso Basado en Roles (RBAC)

### Roles Implementados

<img width="886" height="294" alt="image" src="https://github.com/user-attachments/assets/bc9ff37c-e3fb-4614-b909-0ea76a639c26" />


---

## 4. 🌐 Configuración CORS

### Orígenes Permitidos y Metodos HTTP
<img width="886" height="727" alt="image" src="https://github.com/user-attachments/assets/aeb17783-7cef-4fd8-a3a8-ecc068ee6350" />

---

## 5. ✅ Validaciones de Entrada

<img width="886" height="148" alt="image" src="https://github.com/user-attachments/assets/28d7b108-a033-4302-bce1-b3e45080f9c3" />


### DTOs (Data Transfer Objects)

Todos los endpoints implementan validación mediante DTOs utilizando `class-validator`:

**Ejemplo: Exercise DTO**

<img width="886" height="396" alt="image" src="https://github.com/user-attachments/assets/b086fdcf-589b-42f6-87a8-8685c11f690d" />


- Implementar manejo de errores uniforme (codigos HTTP y mensajes Json)

La tecnoligia NestJS permite el manejo de errores de forma automatica.

<img width="886" height="425" alt="image" src="https://github.com/user-attachments/assets/1832a818-ba4d-4b45-bd1b-47b27afd15bd" />



**Mensajes JSON**

<img width="886" height="352" alt="image" src="https://github.com/user-attachments/assets/98c05961-5eff-422d-bacf-43b6cc68170b" />


- Probar login y rutas protegidas con Postman/Swagger

Prueba de login en Postman
<img width="938" height="523" alt="image" src="https://github.com/user-attachments/assets/7e43c975-3d02-4803-9bc0-e8f293f42231" />

Prueba de Register en Postman
<img width="940" height="528" alt="image" src="https://github.com/user-attachments/assets/879bf687-3772-49d0-8020-e484998c47aa" />

---

## 6. 🔄 Manejo de Errores

### Documentar resultados (capturas de respuesta 200, 401, 403)

Codigo Exito (200)

<img width="886" height="404" alt="image" src="https://github.com/user-attachments/assets/9aa973cd-a343-490a-98c7-6725de6410e7" />


Codigo Error (401)

<img width="886" height="381" alt="image" src="https://github.com/user-attachments/assets/0dbcc2c3-8ef3-4dbf-bbaa-2790ff681767" />
