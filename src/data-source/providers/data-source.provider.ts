import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataSourceProvider {
  private connection: any; // Aquí iría tu conexión a BD, Redis, etc.

  constructor(private readonly configService: ConfigService) {}
}
