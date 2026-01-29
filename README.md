# 📘 Guía de Instalación, Ejecución y Validación del Proyecto

Este documento describe paso a paso el proceso para levantar el entorno completo del proyecto, validar la base de datos, ejecutar el seeder y comprobar el flujo completo de autenticación y publicaciones mediante pruebas manuales.

---

---
# link del video explicatorio:

- Primera parte(se me corto y no pude en uno solo)
-- https://youtu.be/lMbO5zNIfZ0

- Segunda parte
-- https://youtu.be/MbTIUK8c4jQ

---

## 🧱 Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

- 🐳 **Docker**
- 🐙 **Docker Compose**
- 💻 **Git Bash** (o terminal compatible)
- 🟢 **Node.js** ( para ejecutar el frontend)
- 🔁 **curl**

---

## 🧱 Versiones necesarias

- prisma               : 7.3.0
- @prisma/client       : 7.3.0
- Operating System     : win32
- Architecture         : x64
- Node.js              : v22.14.0
- TypeScript           : 5.9.3
- Query Compiler       : enabled
- PSL                  : @prisma/prisma-schema-wasm 7.3.0-16.9d6ad21cbbceab97458517b147a6a09ff43aa735
- Schema Engine        : schema-engine-cli 9d6ad21cbbceab97458517b147a6a09ff43aa735 (at node_modules\@prisma\engines\schema-engine-windows.exe)
- Default Engines Hash : 9d6ad21cbbceab97458517b147a6a09ff43aa735
- Studio               : 0.13.1

---

## 🧱 Arquitectura

- Backend: NestJS + Prisma ORM(v7)
- Base de datos: PostgreSQL
- Autenticación: JWT
- Frontend: Next.js 16 (App Router)
- Contenedores: Docker + Docker Compose

---

## 🚀 Backend

### Requisitos
- Docker
- Docker Compose

### Levantar el backend

API en http://localhost:3000
Swagger en http://localhost:3000/api

PostgreSQL en contenedor

Endpoints principales
Método	Endpoint	Descripción
POST	/auth/login	Login con email y password
GET	/posts	Listar publicaciones
POST	/posts	Crear publicación
Autenticación
JWT enviado en header:
Authorization: Bearer <token>

---
## 🚀 Frontend

Next.js 16.1.6 (Turbopack)
hacer el respectivo ``` npm i ```
y para ejecutar ya cuando el backend este en microservicios se debe ejecutar desde el local solo el front:

```bash
npm run dev
```
luego de eso en el 
Local:         http://localhost:3001

ingresar al login
http://localhost:3001/login

---

## 🚀 Inicialización del Entorno

###clonar repositorio hacer el npm i de cada uno de los REPO(backend y frontend)


### 1️⃣ Detener y limpiar contenedores previos

Este paso garantiza que no existan volúmenes ni contenedores antiguos que puedan interferir con el entorno actual.

```bash
docker compose down -v
```
Descripción:

down: detiene los contenedores.

-v: elimina los volúmenes (base de datos limpia).

### 2️⃣ Construcción de imágenes desde cero
Se construyen nuevamente todas las imágenes Docker sin usar cache, asegurando que el código y dependencias estén actualizados.

```bash
docker compose build --no-cache
```

### 3️⃣ Levantar los servicios
Se inician los contenedores definidos en docker-compose.yml, incluyendo:

🗄️ Base de datos PostgreSQL

🧩 Microservicio(s) Backend (API)
```bash
docker compose up
```
📌 Nota: Este proceso puede tardar algunos minutos la primera vez.

🌱 Seeder de Base de Datos
Una vez los contenedores estén en ejecución, se procede a ejecutar el seeder para poblar la base de datos con usuarios y publicaciones iniciales.

### 4️⃣ Acceder al contenedor de la API

```bash
docker compose exec api sh
```
Esto abre una terminal dentro del contenedor del backend.

### 5️⃣ Ejecutar el seeder con Prisma

Dentro del contenedor, ejecuta:

```bash
npx prisma db seed
```

Este comando:

👤 Crea usuarios de prueba.
✅ Garantiza que el sistema tenga datos iniciales para pruebas.

🗄️ Validación de la Base de Datos
Para verificar que las tablas y datos fueron creados correctamente, se accede directamente a PostgreSQL.

### 6️⃣ Acceder al contenedor de la base de datos

Desde Git Bash o la terminal del sistema:

```bash
docker exec -it social_db psql -U postgres -d social_db
```

### 7️⃣ Verificar tablas existentes

Dentro de PostgreSQL, ejecuta:

```bash
\dt
```
Esto debe mostrar al menos las tablas:

- User
- Post

### 8️⃣ Consultar registros
```bash
SELECT * FROM "User";
SELECT * FROM "Post";
```

Con esto se valida que:

✅ Existen usuarios creados.

✅ Cada usuario tiene al menos una publicación asociada.
---
##🔐 Pruebas de Autenticación

### 9️⃣ Login de usuario (JWT)
Se realiza una autenticación vía curl para obtener el token JWT.

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"richard@example.com\",\"password\":\"password123\"}"
```

📌 Importante:
La respuesta incluirá un access_token que se utilizará en los siguientes pasos.

## 📝 Pruebas de Publicaciones
---
### 🔟 Obtener publicaciones (endpoint protegido)
Reemplaza REEMPLAZA-POR-TOKEN por el token recibido en el login.

```bash
curl http://localhost:3000/posts \
  -H "Authorization: Bearer REEMPLAZA-POR-TOKEN"
```
Este endpoint:
📄 Retorna la lista de publicaciones.

🔐 Valida correctamente la autenticación JWT.

🔄 Confirma el flujo completo backend → base de datos.
