/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { LoanStatus } from '../entities/loan.entity';

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
  @IsEnum(LoanStatus)
  @IsNotEmpty()
  status: LoanStatus;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  client_id: string;
}
