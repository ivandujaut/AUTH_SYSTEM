import { Controller, Get } from '@nestjs/common';
import { SystemService } from '../../domain/services/system.service.js';

@Controller()
export class HealthController {
  constructor(private readonly systemService: SystemService) {}

  @Get()
  getRoot() {
    return 'NestJS + TypeScript Server';
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
}
