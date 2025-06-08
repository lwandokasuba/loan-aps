/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { LoanStatus } from '../entities/loan.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateLoanDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
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
