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
# 🧪 Inicializa el entorno completo con Docker (API + DB), aplica el esquema y seed de desarrollo, y corre tests
# ==============================

dev-init: dev-up db-push seed-dev-docker

# ==============================
# 🚀 Despliegue en Producción con Docker Compose
# ==============================

prod-up:
	$(DC_PROD) up --build -d

prod-init:
	make prod-up && make prod-migrate && make prod-seed

prod-down:
	$(DC_PROD) down -v

prod-logs:
	$(DC_PROD) logs -f api

# ==============================
# 📦 Producción - Migraciones y Seed
# ==============================

prod-migrate:
	docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy --schema=./prisma/schema.prisma

prod-seed:
	docker compose -f docker-compose.prod.yml exec api npm run seed:run

# ==============================
# 🔧 Prisma ORM
# ==============================

db-push:
	$(DC_DEV) exec api npx prisma db push

studio:
	env $(shell cat .env.test.local | xargs) npx prisma studio

seed:
	$(DC_DEV) exec api npm run seed:run

seed-dev:
	npm run seed:dev:local

seed-dev-docker:
	$(DC_DEV) exec api npx ts-node -r tsconfig-paths/register src/data-source/seed.ts

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
	$(DC_DEV) exec api npm run test:e2e

test-cov:
	npm run test:cov:all

test-cov-unit:
	npm run test:cov:unit

test-cov-e2e:
	npm run test:cov:e2e

test-watch:
	npm run test:watch

test-local:
	make db-up && \
	env $(shell cat .env.test.local | xargs) npx prisma db push --schema=prisma/schema.prisma && \
	env $(shell cat .env.test.local | xargs) node -r dotenv/config ./node_modules/.bin/ts-node -r tsconfig-paths/register src/data-source/seed.ts && \
	env $(shell cat .env.test.local | xargs) npm run test && \
	make studio-test