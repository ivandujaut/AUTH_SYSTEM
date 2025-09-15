import { IsUUID, IsDateString } from 'class-validator';

export class CreatePlacementDto {
  @IsUUID()
  propertyId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
