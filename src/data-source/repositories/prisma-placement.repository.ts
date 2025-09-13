import { PlacementRepository } from '@/domain/repositories/placement.repository';
import { CreatePlacementDto } from '@/presentation/dto/create-placement.dto';
import { Placement, PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPlacementRepository implements PlacementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreatePlacementDto): Promise<Placement> {
    return await this.prisma.placement.create({
      data: {
        propertyId: dto.propertyId,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });
  }

  async findAll(): Promise<Placement[]> {
    return await this.prisma.placement.findMany({
      include: {
        property: true,
      },
    });
  }
}
