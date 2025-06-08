import { Loan } from 'src/loan/entities/loan.entity';
import { BaseEntity } from 'src/types';
import { AuthUser } from 'src/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('clients')
export class Client extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  national_id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone_number: string;

  @OneToMany(() => Loan, (loan) => loan.client)
  loans?: Loan[];

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => AuthUser, (authUser) => authUser.clients)
  @JoinColumn({ name: 'user_id' })
  user: AuthUser;
}
