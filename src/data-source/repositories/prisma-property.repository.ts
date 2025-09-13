import { Injectable } from '@nestjs/common';
import { PropertyRepository } from '@/domain/repositories/property.repository';
import { Property } from '@/domain/entities/property.entity';
import { PrismaClient } from '@prisma/client';
import { CreatePropertyDto } from '@/presentation/dto/create-property.dto';

@Injectable()
export class PrismaPropertyRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Property[]> {
    const properties = await this.prisma.property.findMany();
    return properties.map(
      (p) => new Property(p.id, p.symbol, p.name, p.navPrice.toNumber(), p.status, p.createdAt, p.updatedAt),
    );
  }

  async create(dto: CreatePropertyDto): Promise<Property> {
    const property = await this.prisma.property.create({
      data: {
        name: dto.name,
        symbol: dto.symbol,
        navPrice: dto.navPrice,
      },
    });

    return new Property(
      property.id,
      property.symbol,
      property.name,
      property.navPrice.toNumber(),
      property.status,
      property.createdAt,
      property.updatedAt,
    );
  }
}
