<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# AUTH_SERVICE

Backend desarrollado con NestJS + PostgreSQL + Prisma para la gestión de autenticación, inversiones y propiedades, con foco en diseño escalable y mantenible.

---

## Tecnologías utilizadas

- **NestJS** (modular y escalable)
- **PostgreSQL** (persistencia de datos)
- **Prisma ORM**
- **Jest** (testing)
- **Docker** + **Docker Compose** (despliegue)
- **Makefile** (automatización de tareas)

---

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

---

## 🧪 Flujo de prueba en desarrollo (entorno local)

> Requisitos: Docker, Node.js, y `make` instalados.

### 1. Levantar entorno de desarrollo

```bash
make dev-up
```

Esto levanta:

- `volsmart_api`: Servidor NestJS en modo desarrollo con hot reload.
- `volsmart_db`: Contenedor PostgreSQL.

---

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

---

### 3. Verificar que la API funcione

Accedé a: [http://localhost:8080](http://localhost:8080)

Podés usar Postman con el entorno `AUTH_SYSTEM_LOCAL`.

---

### 4. Logs y herramientas opcionales

```bash
make dev-logs   # Ver logs del servidor
make studio     # Abre Prisma Studio (inspección visual de la DB)
```

---

## 🚀 Despliegue en Producción con Docker Compose

> Requiere tener Docker instalado.

### 1. Iniciar entorno de producción

```bash
make prod-up
```

Este comando levanta:

- `volsmart_api`: Aplicación backend en modo producción.
- `volsmart_db`: Contenedor PostgreSQL con volumen persistente.

---

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

---

### 3. Verificar aplicación corriendo

Accedé a la API en: [http://localhost:8080](http://localhost:8080)

---

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

---

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

---

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

---

## Variables de entorno

### Archivos `.env` disponibles

El proyecto utiliza diferentes archivos `.env` según el entorno:

- `.env`: archivo principal usado tanto en desarrollo como producción dentro de los contenedores. Contiene variables comunes como credenciales de DB y JWT_SECRET.
- `.env.studio`: usado exclusivamente por `Prisma Studio` al ejecutarse en modo local. Reemplaza `DB_HOST=db` por `DB_HOST=localhost` para que Prisma pueda conectarse al contenedor de PostgreSQL desde fuera del contenedor.

> ⚠️ Recordá que al correr `make studio`, Prisma Studio corre en tu máquina local, por lo tanto debe conectarse a la base de datos mediante `localhost` en lugar de `db`.

```
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

---

## Utilidades

```bash
make lint          # Corre ESLint
make format        # Formatea el código
make test          # Corre tests unitarios + e2e
make studio        # Prisma Studio (GUI para inspección de la DB)

# Flujo para entorno de desarrollo con Docker
make dev-init      # Levanta API + DB, aplica schema y seed de desarrollo

# Flujo para entorno de producción con Docker
make prod-init     # Levanta API + DB, aplica migraciones y seed de producción
```

---

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