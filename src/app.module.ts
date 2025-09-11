import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './presentation/controllers/health.controller.js';
import { SystemService } from './domain/system.service.js';
import { DataSourceProvider } from './data-source/providers/data-source.provider.js';
import { configuration } from './config/configuration.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [HealthController],
  providers: [SystemService, DataSourceProvider],
})
export class AppModule {}
