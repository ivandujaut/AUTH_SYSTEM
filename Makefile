# Variables (pueden extenderse más adelante)
SHELL := /bin/bash

# 🔧 Infraestructura
up:
	docker compose up -d

down:
	docker compose down -v

# 🧪 Prisma
db-push:
	npx prisma db push

studio:
	npx prisma studio

seed:
	npm run seed:run

# 🧹 Utilidades
lint:
	npm run lint

format:
	npm run format

# 🚀 Nest
dev:
	npm run start:dev

build:
	npm run build

start:
	npm run start

# 🧪 Tests
test:
	npm run test

test-watch:
	npm run test:watch

test-cov:
	npm run test:cov

test-e2e:
	npm run test:e2e