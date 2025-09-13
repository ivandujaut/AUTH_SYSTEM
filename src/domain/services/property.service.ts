import { Injectable } from '@nestjs/common';
import { PropertyRepository } from '../repositories/property.repository';
import { Property } from '../entities/property.entity';
import { CreatePropertyDto } from '@/presentation/dto/create-property.dto';

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepo: PropertyRepository) {}

  async findAll(): Promise<Property[]> {
    return this.propertyRepo.findAll();
  }

  async create(dto: CreatePropertyDto): Promise<Property> {
    return this.propertyRepo.create(dto);
  }
}
