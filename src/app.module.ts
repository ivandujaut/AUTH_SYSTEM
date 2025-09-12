import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DataSourceProvider } from './data-source/providers/data-source.provider';
import { FakeController } from './presentation/controllers/fake.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { JwtStrategy } from './presentation/jwt.strategy';
import { Module } from '@nestjs/common';
import { SystemService } from './domain/system.service';
import { SecureController } from './presentation/controllers/secure.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [HealthController, FakeController, SecureController],
  providers: [SystemService, DataSourceProvider, JwtStrategy],
})
export class AppModule {}
