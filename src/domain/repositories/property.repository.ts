import { Property } from '@/domain/entities/property.entity';
import { CreatePropertyDto } from '@/presentation/dto/create-property.dto';

export abstract class PropertyRepository {
  abstract findAll(): Promise<Property[]>;
  abstract create(data: CreatePropertyDto): Promise<Property>;
}
