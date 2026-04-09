# Panel de Administración Remota (SFTP/FTP)

Esta es una aplicación web privada construida con Next.js (App Router), diseñada para administrar archivos remotos en servidores de juegos (vía SFTP) y repositorios FastDL (vía FTP), siguiendo estrictos controles de seguridad para prevenir accesos no autorizados.

## Características

- 🔒 **Conexiones 100% Backend:** Las credenciales y lógicas de acceso nunca se exponen al cliente.
- 🛡️ **Seguridad Estricta:** 
  - Restricción de rutas: un usuario solo puede interactuar en una carpeta prefijada por configuración.
  - Mitigación de Path Traversal: limpieza exhaustiva de nombres de archivo.
  - Validación en servidor para extensiones (ej: solo `.bz2` en FTP).
  - Autenticación simple mediante JWT y cookies HttpOnly.
- 🎨 **Interfaz Moderna:** Diseño oscuro (dark mode), estructurado en pestañas, responsivo y ordenado.

---

## ⚙️ Estructura del Proyecto

📁 **src/app**: Contiene las rutas (frontend) y Server Actions de Next.js.
 - `login/`: Página y estilos del login.
 - `actions/`: Acciones ejecutadas 100% en el servidor (SFTP, FTP, Autenticación y Editor de textos).
📁 **src/components**: Componentes funcionales interactivos (SFTP, FTP, Editor CFG).
📁 **src/lib**: Librerías y lógica principal (conexión SSH2, Basic-FTP y sesión JWT).

---

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/es/) (Versión 18.17 o superior)
- NPM (viene con Node.js)

---

## 🚀 Instalación y Ejecución Local

1. **Instalar las dependencias:**
   Abre una terminal en la raíz de este proyecto y ejecuta:
   ```bash
   npm install
   ```

2. **Configurar las credenciales:**
   - Copia el archivo llamado `.env.example` y renómbralo a `.env.local`
   - O bien, abre el archivo `.env.local` que ya ha sido creado
   - Verifica los accesos y credenciales definidas allí:
     - `APP_USERNAME` y `APP_PASSWORD` para iniciar sesión en la web.
     - Rutas base prefijadas por entorno.

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Acceder:**
   Abre tu navegador web y entra en: [http://localhost:3000](http://localhost:3000)
   - Serás redirigido al panel de login.
   - Usa los datos de la variable de entorno para acceder (`admin` / `admin` por defecto si no cambias `.env.local`).

---

## 📦 Instrucciones para Despliegue en Producción

Puedes desplegar rápidamente esta plataforma en Vercel, o mediante un servidor privado propio (VPS / Docker).

### OPCIÓN A) Despliegue en un VPS con Node.js

1. Clona el repositorio en tu servidor.
2. Crea el archivo `.env` configurando todas las variables reales.
3. Instala dependencias y compila:
   ```bash
   npm install
   npm run build
   ```
4. Inicia el servidor de producción:
   ```bash
   npm run start
   ```
*(Nota: Para mantenerlo encendido 24/7 puedes utilizar administradores de procesos como **PM2**: `pm2 start npm --name "panel" -- start`)*

---

### Módulos Implementados

1) **SFTP (Mapas Juego):**
   - Utiliza la ruta base definida en `SFTP_BASE_PATH`.
   - Carga el contenido sin posiblidad de navegar a otras carpetas.
   - Se puede interactuar para Subir/Eliminar archivos (Ej. subir mapas de uso normal).
2) **FTP (FastDL):**
   - Utiliza la ruta base definida en `FTP_BASE_PATH`.
   - Únicamente admite subida de archivos comprimidos nativamente validos en FastDL (`.bz2`).
3) **Editor CFG (`mapcycle.txt`):**
   - Extraído desde `SFTP_TEXT_FILE_PATH`.
   - Entorno dedicado que previene alterar otros archivos en el disco, leyendo y sobreescribiendo sólamente la ubicación designada.
