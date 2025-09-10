# Makefile
SHELL := /bin/bash

# ==============================
# 🐘 PostgreSQL en Docker (solo DB)
# ==============================

db-up:
	docker compose -f docker-compose.dev.yml up -d

db-down:
	docker compose -f docker-compose.dev.yml down -v

# ==============================
# 🐳 Backend completo en Docker (API + DB)
# ==============================

compose-up:
	docker compose -f docker-compose.prod.yml up --build -d

compose-down:
	docker compose -f docker-compose.prod.yml down -v

logs:
	docker compose -f docker-compose.prod.yml logs -f api

# ==============================
# 🔧 Prisma ORM
# ==============================

db-push:
	npx prisma db push

studio:
	npx prisma studio

seed:
	npm run seed:run

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

test-watch:
	npm run test:watch

test-cov:
	npm run test:cov

test-e2e:
	npm run test:e2e