import { Controller, Get } from '@nestjs/common';
import { SystemService } from '../../domain/system.service.js';

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
