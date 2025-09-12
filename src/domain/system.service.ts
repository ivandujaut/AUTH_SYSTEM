import { Injectable } from '@nestjs/common';
import { DataSourceProvider } from '../data-source/providers/data-source.provider';

@Injectable()
export class SystemService {
  constructor(private readonly dataSource: DataSourceProvider) {}
}
