SHELL := /bin/bash

DC_DEV = docker compose -f docker-compose.dev.yml
DC_PROD = docker compose -f docker-compose.prod.yml

# ==============================
# 👨‍💻 Entorno de Desarrollo Completo (API + DB)
# ==============================

dev-up:
	$(DC_DEV) up --build -d

dev-down:
	$(DC_DEV) down -v

dev-logs:
	$(DC_DEV) logs -f api

# ==============================
# 🐘 PostgreSQL solo (útil para tests locales o studio)
# ==============================

db-up:
	$(DC_DEV) up -d db

db-down:
	$(DC_DEV) stop db && $(DC_DEV) rm -f db

# ==============================
# 🧪 Inicializar entorno completo y testear
# ==============================

dev-init:
	make dev-up && make db-push && make seed && make test

# ==============================
# 🚀 Despliegue en Producción con Docker Compose
# ==============================

prod-up:
	$(DC_PROD) up --build -d

prod-down:
	$(DC_PROD) down -v

prod-logs:
	$(DC_PROD) logs -f api

# ==============================
# 🔧 Prisma ORM
# ==============================

db-push:
	npx prisma db push

studio:
	npx prisma studio

seed:
	npm run seed:run

setup-db:
	make db-up && make db-push && make seed

# ==============================
# 🧹 Utilidades
# ==============================

lint:
	npm run lint

format:
	npm run format

# ==============================
# 🚀 NestJS (local)
# ==============================

dev:
	npm run start:dev

build:
	npm run build

start:
	npm run start

# ==============================
# 🧪 Tests
# ==============================

test:
	npm run test

test-unit:
	npm run test:unit

test-e2e:
	npm run test:e2e

test-cov:
	npm run test:cov:all

test-cov-unit:
	npm run test:cov:unit

test-cov-e2e:
	npm run test:cov:e2e

test-watch:
	npm run test:watch