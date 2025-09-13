import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  @IsNotEmpty({ message: 'propertyId is required' })
  propertyId: string;

  @IsString()
  @IsNotEmpty({ message: 'ownerId is required' })
  ownerId: string;

  @IsNumber()
  @IsPositive({ message: 'amount must be greater than 0' })
  amount: number;

  @IsNumber()
  @IsPositive({ message: 'avgPrice must be greater than 0' })
  avgPrice: number;
}
