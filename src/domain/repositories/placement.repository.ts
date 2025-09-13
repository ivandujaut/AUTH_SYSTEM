import { Placement } from '@prisma/client';
import { CreatePlacementDto } from '@/presentation/dto/create-placement.dto';

export abstract class PlacementRepository {
  abstract create(dto: CreatePlacementDto): Promise<Placement>;
  abstract findAll(): Promise<Placement[]>;
}
