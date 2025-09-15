# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto y construir
COPY . .
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS development

WORKDIR /app

# Evita instalar solo las prod deps si alguna cache define NODE_ENV
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY . .
COPY prisma ./prisma

RUN npx prisma generate

# Etapa 2: producción
FROM node:20-alpine AS runner
WORKDIR /app

# Establecer el entorno como producción
ENV NODE_ENV=production

# Crear un usuario no-root para ejecutar la app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar los artefactos desde la etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Asignar permisos y cambiar al usuario no-root
RUN chown -R appuser:appgroup /app
USER appuser

# Comando de arranque
CMD ["node", "dist/main"]