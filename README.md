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

## Flujo de prueba sugerido (local)

> Requiere: Docker y Node.js

```bash
# 1. Levantar solo la DB
make db-up

# 2. Ejecutar migraciones y seeds
make db-push
make seed

# 3. Ejecutar la API en modo desarrollo
make dev

# 4. Acceder a la base de datos (opcional)
make studio
```

También podés levantar todo con:

```bash
make compose-up  # (API + DB en producción dockerizada)
```

---

## Testing manual con Postman

- Asegurate de importar la colección de Postman provista.
- Variables necesarias:
  - `base_url`: por defecto http://localhost:8080
  - `access_token`: generado al hacer login
  - `property_id`: usado para simular inversión

---

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

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=volsmart
DB_PASSWORD=volsmart
DB_NAME=volsmart_db
JWT_SECRET=TEST_SECRET

DATABASE_URL="postgresql://volsmart:volsmart@localhost:5432/volsmart_db"
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