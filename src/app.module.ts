import { AdminController } from './presentation/controllers/admin.controller';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DashboardController } from './presentation/controllers/dashboard.controller';
import { DataSourceProvider } from './data-source/providers/data-source.provider';
import { HealthController } from './presentation/controllers/health.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { JwtStrategy } from './presentation/jwt.strategy';
import { Module } from '@nestjs/common';
import { PermissionsGuard } from './presentation/guards/permissions.guard';
import { SecureController } from './presentation/controllers/secure.controller';
import { SystemService } from './domain/system.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [HealthController, SecureController, DashboardController, AdminController],
  providers: [
    SystemService,
    DataSourceProvider,
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
