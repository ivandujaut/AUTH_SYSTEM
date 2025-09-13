import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './config/configuration';

// JWT y Guards
import { JwtStrategy } from './presentation/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from './presentation/guards/permissions.guard';

// Controllers
import { HealthController } from './presentation/controllers/health.controller';
import { PropertiesController } from './presentation/controllers/properties.controller';
import { PlacementController } from './presentation/controllers/placement.controller';
import { InvestmentController } from './presentation/controllers/investment.controller';

// Domain Services
import { SystemService } from './domain/system.service';
import { PropertyService } from './domain/services/property.service';
import { PlacementService } from './domain/services/placement.service';
import { InvestmentService } from './domain/services/investment.service';

// Repositorio implementado
import { PropertyRepository } from './domain/repositories/property.repository';
import { PrismaPropertyRepository } from './data-source/repositories/prisma-property.repository';
import { PlacementRepository } from './domain/repositories/placement.repository';
import { PrismaPlacementRepository } from './data-source/repositories/prisma-placement.repository';
import { InvestmentRepository } from './domain/repositories/investment.repository';
import { PrismaInvestmentRepository } from './data-source/repositories/prisma-investment.repository';

// Prisma Client
import { PrismaClient } from '@prisma/client';
import { DataSourceProvider } from './data-source/providers/data-source.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [HealthController, PropertiesController, PlacementController, InvestmentController],
  providers: [
    // Core / DB
    PrismaClient,
    DataSourceProvider,
    SystemService,

    // Domain Services
    PropertyService,
    PlacementService,
    InvestmentService,

    // Repositorios
    {
      provide: PropertyRepository,
      useClass: PrismaPropertyRepository,
    },
    {
      provide: PlacementRepository,
      useClass: PrismaPlacementRepository,
    },
    {
      provide: InvestmentRepository,
      useClass: PrismaInvestmentRepository,
    },

    // JWT & Permisos
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
