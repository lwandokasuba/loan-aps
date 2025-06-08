import { Client } from 'src/client/entities/client.entity';
import { BaseEntity } from 'src/types';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum LoanStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('loans')
export class Loan extends BaseEntity {
  @Column({
    type: 'decimal',
    transformer: {
      // Transformer for database to entity (reading from DB)
      from: (value: string | number) => parseFloat(value as string),
      // Transformer for entity to database (writing to DB)
      to: (value: number) => (value !== null ? value : null), // Ensure 2 decimal places when saving
    },
  })
  amount: number;

  @Column({ type: 'int' })
  interest_rate: number;

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.PENDING })
  status: LoanStatus;

  @Column({ type: 'uuid' })
  client_id: string;

  @ManyToOne(() => Client, (client) => client.loans)
  @JoinColumn({ name: 'client_id' })
  client?: Client;
}
