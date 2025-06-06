import { LoanStatus } from '../entities/loan.entity';

export class CreateLoanDto {
  amount: number;
  interest_rate: number;
  status: LoanStatus;
  client_id: string;
}
