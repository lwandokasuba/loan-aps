import { Loan } from 'src/loan/entities/loan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  national_id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone_number: string;

  @OneToMany(() => Loan, (loan) => loan.client_id)
  loans?: Loan[];
}
