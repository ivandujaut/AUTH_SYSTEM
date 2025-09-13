import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Symbol is required' })
  symbol: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber({}, { message: 'navPrice must be a number' })
  @Min(0, { message: 'navPrice must be at least 0' })
  navPrice: number;

  @IsString()
  @IsOptional()
  description?: string;
}
