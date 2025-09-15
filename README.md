<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# AUTH_SERVICE

## Contenidos

- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Decisiones de diseño clave](#decisiones-de-diseño-clave)
- [🧪 Flujo de prueba en desarrollo (entorno local)](#-flujo-de-prueba-en-desarrollo-entorno-local)
- [🛠️ Crear archivo `.env`](#-crear-archivo-env-obligatorio-para-entornos-docker)
- [🧪 `.env.test.local` para testing](#-crear-archivo-envtestlocal-para-pruebas-locales)
- [🚀 Despliegue en Producción](#despliegue-en-producción-con-docker-compose)
- [🧪 Tests en Postman](#-tests-en-postman)
- [Convenciones del proyecto](#convenciones-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Utilidades](#utilidades)
- [🧪 Ejecución de tests de forma local](#-ejecución-de-tests-de-forma-local)
- [🧪 Flujo general de Makefile](#-flujo-general-de-makefile)
- [Notas finales](#notas-finales)
- [🔍 Consideraciones generales](#-consideraciones-generales)


--

## Tecnologías utilizadas

- **NestJS** (modular y escalable)
- **PostgreSQL** (persistencia de datos)
- **Prisma ORM**
- **Jest** (testing)
- **Docker** + **Docker Compose** (despliegue)
- **Makefile** (automatización de tareas)

--

## Decisiones de diseño clave

### Clean Architecture

El código está organizado por capas (presentación, dominio, infraestructura), permitiendo:
- Aislar la lógica de negocio
- Facilitar la escalabilidad y testeo
- Reemplazar tecnología sin afectar la lógica

### Sistema de permisos por rol

Se implementó un sistema de permisos granular con guardas que:
- Restringe acceso por rol (`USER`, `MANAGER`)
- Aísla la lógica de autorización de los controladores

### Validaciones y DTOs

Uso de DTOs (Data Transfer Objects) para:
- Validar entradas de usuario
- Documentar los contratos de cada endpoint

### Prisma + PostgreSQL

- Prisma facilita migraciones, tipado fuerte y performance.
- Uso de `Decimal` para mantener precisión en valores monetarios.

### Test Driven Development (TDD)

- Tests unitarios y de integración con buena cobertura.
- Scripts de test organizados por módulo.
- Postman Collection para testing manual del API.

--





## 🧪 Flujo de prueba en desarrollo (entorno local)

> Requisitos: Docker, Node.js, y `make` instalados.

### 1. Levantar entorno de desarrollo

```bash
make dev-up
```

Esto levanta:

- `volsmart_api`: Servidor NestJS en modo desarrollo con hot reload.
- `volsmart_db`: Contenedor PostgreSQL.

--

### 2. Crear estructura de tablas y popular con datos de ejemplo

```bash
make db-push    # Aplica el esquema de la base de datos
make seed       # Inserta usuarios de prueba
```

O bien, ejecutá ambos con:

```bash
make dev-init
```

Esto ejecuta en orden:
- `dev-up`
- `db-push`
- `seed-dev`

--

### 3. Verificar que la API funcione

Accedé a: [http://localhost:8080](http://localhost:8080)

Podés usar Postman con el entorno `AUTH_SYSTEM_LOCAL`.

--

### 4. Logs y herramientas opcionales

```bash
make dev-logs   # Ver logs del servidor
make studio     # Abre Prisma Studio (inspección visual de la DB)
```

--

## 🛠️ Crear archivo `.env` obligatorio para entornos Docker

Antes de poder levantar el entorno de desarrollo o producción usando Docker, es necesario crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DB_HOST=db
DB_PORT=5432
DB_USER=volsmart
DB_PASSWORD=volsmart
DB_NAME=volsmart_db

POSTGRES_USER=volsmart
POSTGRES_PASSWORD=volsmart
POSTGRES_DB=volsmart_db

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

JWT_SECRET=TEST_SECRET
```

> ⚠️ Este archivo es utilizado por los comandos `make dev-init` y `make prod-init` para configurar correctamente la base de datos y levantar los contenedores. No debe ser versionado.

--

### 🧪 Crear archivo `.env.test.local` para pruebas locales

Para ejecutar pruebas sin levantar contenedores, es necesario crear el archivo `.env.test.local` en la raíz del proyecto con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=volsmart
DB_PASSWORD=volsmart
DB_NAME=volsmart_db

DATABASE_URL=postgresql://volsmart:volsmart@localhost:5432/volsmart_db

JWT_SECRET=TEST_SECRET
```

> ⚠️ Este archivo se usa exclusivamente durante `make test-local` y `make studio`. No debe ser versionado.

## 🚀 Despliegue en Producción con Docker Compose

> Requiere tener Docker instalado.

### 1. Iniciar entorno de producción

```bash
make prod-up
```

Este comando levanta:

- `volsmart_api`: Aplicación backend en modo producción.
- `volsmart_db`: Contenedor PostgreSQL con volumen persistente.

--

### 2. Inicializar base de datos en producción

```bash
make prod-migrate   # Aplica las migraciones
make prod-seed      # Inserta datos de prueba
```

O bien, podés ejecutar ambos con:

```bash
make prod-init
```

Esto ejecuta en orden:
- `prod-up`
- `prod-migrate`
- `prod-seed`

--

### 3. Verificar aplicación corriendo

Accedé a la API en: [http://localhost:8080](http://localhost:8080)

--

### 4. Detener entorno de producción

```bash
make prod-down
```
---
## 🧪 Tests en Postman

1. Asegúrate de tener una cuenta en [Postman](https://www.postman.com/) y haber aceptado la invitación al workspace compartido (via mail).

2. Una vez dentro del workspace, deberías ver:
   - La colección con todos los endpoints.
   - El entorno `AUTH_SYSTEM_LOCAL`, que ya contiene las variables necesarias.

3. Para comenzar a probar:
   - Seleccioná el entorno `AUTH_SYSTEM_LOCAL` en la parte superior derecha.
   - Ejecutá los endpoints deseados desde la colección.
   - Podés utilizar `{{base_url}}`, `{{access_token}}`, etc., ya preconfigurados.

4. Si deseás correr una colección completa como test suite:
   - Hacé clic en "Run collection".
   - Asegurate de que el entorno seleccionado sea `AUTH_SYSTEM_LOCAL`.
   - Ejecutá la colección.

--

### 📝 Notas

- El backend debe estar corriendo (`make dev-up` o `make prod-up`) para que los endpoints respondan correctamente.
- Si modificás variables en `.env`, recordá reflejarlas en el environment de Postman si fuera necesario.

## Convenciones del proyecto

### Estructura del código

```
/src
 ├── data-source/          # Prisma ORM y seeders
 ├── domain/               # Servicios, entidades, interfaces
 ├── presentation/         # Controladores, guards, decorators
 ├── config/               # Config global
 └── main.ts               # Entry point
```

### Rutas principales

| Rol      | Método | Ruta                        | Descripción                          |
|----------|--------|-----------------------------|--------------------------------------|
| USER     | GET    | `/investments/me`           | Ver sus inversiones                  |
| USER     | GET    | `/investments/me/summary`   | Ver resumen de sus inversiones       |
| USER     | POST   | `/investments`              | Invertir en una propiedad            |
| MANAGER  | GET    | `/investments`              | Ver todas las inversiones            |
| MANAGER  | GET    | `/investments/property/:id` | Ver inversiones por propiedad        |

--

## Mejoras para escalar el sistema

1. **Persistencia distribuida / Sharding**  
   Dividir por usuarios o propiedades si se escala a millones de registros.

2. **Cache (Redis)**  
   Para acelerar respuestas de agregaciones como el resumen de inversiones.

3. **Indexado avanzado en PostgreSQL**  
   Crear índices compuestos en queries más usadas.

4. **Auditoría y trazabilidad**  
   Guardar logs de inversión, cambios y accesos.

5. **Webhooks y notificaciones**  
   Notificar por mail o eventos internos (event sourcing).

6. **Autenticación SSO o externa**  
   Para empresas o integración con otros sistemas.

7. **Uso de colas (RabbitMQ, Kafka)**  
   Para procesamiento asíncrono de inversiones u otras operaciones pesadas.

--

## Variables de entorno

### Archivos `.env` disponibles

El proyecto utiliza diferentes archivos `.env` según el entorno:

- `.env`: archivo principal usado tanto en desarrollo como producción dentro de los contenedores. Contiene variables comunes como credenciales de DB y JWT_SECRET.
- `.env.studio`: usado exclusivamente por `Prisma Studio` al ejecutarse en modo local. Reemplaza `DB_HOST=db` por `DB_HOST=localhost` para que Prisma pueda conectarse al contenedor de PostgreSQL desde fuera del contenedor.

--

## Utilidades

```bash
make lint          # Corre ESLint
make format        # Formatea el código
make test          # Corre tests unitarios + e2e
make studio        # Abre Prisma Studio para inspección visual
# Flujo para entorno de desarrollo con Docker
make dev-init      # Levanta API + DB, aplica schema y seed de desarrollo

# Flujo para entorno de producción con Docker
make prod-init     # Levanta API + DB, aplica migraciones y seed de producción
```

--

## 🧪 Ejecución de tests de forma local

> Este flujo corre los tests usando tu base de datos local (fuera de Docker) y variables de entorno específicas para testing.

### 1. Crear archivo `.env.test.local`

Este archivo define las variables que apuntan a tu base de datos local.

```bash
touch .env.test.local
```

Con este contenido:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=volsmart
DB_PASSWORD=volsmart
DB_NAME=volsmart_db

DATABASE_URL=postgresql://volsmart:volsmart@localhost:5432/volsmart_db
JWT_SECRET=TEST_SECRET
```

--

### 2. Ejecutar script completo de pruebas

```bash
make test-local
```

Este comando ejecuta:

- `prisma db push` sobre la base local (`localhost`)
- `seed-dev` cargando los usuarios necesarios
- Todos los tests (`unitarios` + `e2e`) con la configuración de `.env.test.local`

--

### 3. Inspeccionar la base con Prisma Studio (opcional)

```bash
make studio
```

> Requiere tener instalado `npx`.

--

### Notas

- El archivo `.env.test.local` **nunca debe versionarse** (`.gitignore` ya lo excluye).
- Usar este flujo te permite correr tests sin levantar Docker.

--

## 🧪 Flujo general de Makefile

### ✅ Ejecutar tests de forma local (sin Docker)

```bash
make test-local
```

> Detalles sobre cómo configurar `.env.test.local` en la sección anterior: [🧪 Ejecución de tests de forma local](#-ejecución-de-tests-de-forma-local).

--

### 🛠️ Levantar entorno de desarrollo con Docker

```bash
make dev-init
```

Ejecuta:
1. `make dev-up` → levanta `api` + `db` usando `docker-compose.dev.yml`
2. `make db-push` → aplica el schema con Prisma
3. `make seed-dev-docker` → ejecuta el seed dentro del contenedor

Verificar en: [http://localhost:8080](http://localhost:8080)

--

### 🚀 Levantar entorno de producción con Docker

```bash
make prod-init
```

Ejecuta:
1. `make prod-up` → levanta servicios con `docker-compose.prod.yml`
2. `make prod-migrate` → aplica migraciones
3. `make prod-seed` → ejecuta el seed productivo

--

De esta forma, cualquier persona puede entender y ejecutar el flujo completo.

--

## Notas finales

El proyecto fue pensado para ser:
- Extensible (roles, inversiones, propiedades)
- Fácil de testear (alta cobertura)
- Mantenible (clean code + clean architecture)

### Roles y permisos

- `USER`: puede invertir, ver sus inversiones y consultar propiedades activas.
- `MANAGER`: supervisa las inversiones y propiedades, pero **no puede invertir**.
- `ADMIN`: rol reservado para tareas administrativas y de configuración.

> Por diseño, solo los usuarios con rol `USER` pueden crear inversiones.

--

## 🔍 Consideraciones generales

- El backend debe estar corriendo (`make dev-up` o `make prod-up`) para que los endpoints y los tests respondan correctamente.
- Si modificás variables en `.env`, recordá reflejarlas también en Postman o en los entornos `.env.test.local` y `.env.studio` según corresponda.
- El archivo `.env.test.local` **nunca debe versionarse** (`.gitignore` ya lo excluye).
- Usar `make test-local` te permite correr los tests sin necesidad de levantar Docker.