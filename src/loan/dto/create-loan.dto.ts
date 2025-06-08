/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  interest_rate: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  client_id: string;
}
