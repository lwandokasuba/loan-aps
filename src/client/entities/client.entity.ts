import { Loan } from 'src/loan/entities/loan.entity';
import { BaseEntity } from 'src/types';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('clients')
export class Client extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  national_id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone_number: string;

  @OneToMany(() => Loan, (loan) => loan.client_id)
  loans?: Loan[];
}
