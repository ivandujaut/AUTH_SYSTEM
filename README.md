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

## Flujo de prueba (entorno local)

> Requisitos: Docker, Node.js, y `make`

```bash
# 1. Levantar entorno completo (API + DB + Prisma Studio)
make dev-up

# 2. Aplicar migraciones y datos iniciales
make db-push
make seed

# 3. Ver logs de la API (opcional)
make dev-logs

# 4. Abrir Prisma Studio (GUI de la base de datos)
make studio
```

---

## 🚀 Despliegue en Producción con Docker Compose

### Levantar entorno de producción con Make

> Requiere tener Docker instalado.

```bash
make prod-up       # Levanta API + DB en producción
```

Esto iniciará los siguientes servicios:

- `volsmart_api`: La aplicación backend en modo producción.
- `volsmart_db`: El contenedor de PostgreSQL con volúmenes persistentes.

Para detener el entorno:

```bash
make prod-down
```
---
## Tests en Postman

Se incluye una colección de Postman para probar los endpoints del servicio.

### Pasos para probar

1. Abrí Postman.
2. Importá la colección `challenge.postman_collection.json`.
3. Importá las variables de entorno desde `challenge_environment.postman_environment.json`.
4. Seleccioná el entorno activo (arriba a la derecha en Postman).
5. Ejecutá los endpoints en el orden adecuado:
   - Autenticación (Login)
   - Propiedades
   - Inversiones
   - Resumen de inversiones

> ⚠️ Asegurate de tener corriendo el backend en `http://localhost:8080` o actualizá la variable `base_url` si usás otra dirección.

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

## Variables de entorno `.env`

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
make test          # Corre unit + e2e
make studio        # Prisma Studio (GUI DB)
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