import { INestApplication } from '@nestjs/common';
import { Server } from 'http';

/**
 * Extracts the Nest HTTP server with type safety.
 */
export function getServer(app: INestApplication): Server {
  return app.getHttpServer() as Server;
}
