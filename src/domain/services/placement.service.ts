import { Injectable } from '@nestjs/common';
import { CreatePlacementDto } from '@/presentation/dto/create-placement.dto';
import { Placement } from '@prisma/client';
import { PlacementRepository } from '../repositories/placement.repository';

@Injectable()
export class PlacementService {
  constructor(private readonly placementRepository: PlacementRepository) {}

  async create(dto: CreatePlacementDto): Promise<Placement> {
    return await this.placementRepository.create(dto);
  }

  async findAll(): Promise<Placement[]> {
    return await this.placementRepository.findAll();
  }
}
