import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Controller()
export class HealthController {
  @Get()
  @Public()
  getStatus() {
    return 'NestJS + TypeScript Server';
  }

  @Get('health')
  @Public()
  getHealth() {
    return { status: 'ok' };
  }
}
