import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataSourceProvider {
  private connection: any;

  constructor(private readonly configService: ConfigService) {}
}
