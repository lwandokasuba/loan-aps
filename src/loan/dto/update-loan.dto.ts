/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLoanDto } from './create-loan.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LoanStatus } from '../entities/loan.entity';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {
  @ApiProperty()
  @IsOptional()
  @IsEnum(LoanStatus)
  @IsNotEmpty()
  status?: LoanStatus;
}
