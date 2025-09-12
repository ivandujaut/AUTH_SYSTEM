import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  getRoot() {
    return 'NestJS + TypeScript Server';
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
}
