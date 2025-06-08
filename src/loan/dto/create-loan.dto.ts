import { ApiProperty } from '@nestjs/swagger';
import { LoanStatus } from '../entities/loan.entity';

export class CreateLoanDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  interest_rate: number;

  @ApiProperty()
  status: LoanStatus;

  @ApiProperty()
  client_id: string;
}
