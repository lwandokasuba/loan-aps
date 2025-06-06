import { Client } from 'src/client/entities/client.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum LoanStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'money' })
  amount: number;

  @Column({ type: 'int' })
  interest_rate: number;

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.PENDING })
  status: LoanStatus;

  @Column({ type: 'uuid' })
  client_id: string;

  @ManyToOne(() => Client, (client) => client.loans)
  client?: Client;
}
