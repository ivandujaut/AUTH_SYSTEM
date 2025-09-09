import { Injectable } from '@nestjs/common';
import { DataSourceProvider } from '../../data-source/providers/data-source.provider.js';

@Injectable()
export class SystemService {
  constructor(private readonly dataSource: DataSourceProvider) {}
}
