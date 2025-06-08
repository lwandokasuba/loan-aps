import { OmitType } from '@nestjs/swagger';
import { Client } from '../../client/entities/client.entity';
import { BaseEntity } from '../../types';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  GUEST = 'guest',
  STAFF = 'staff',
}

@Entity('users')
export class AuthUser extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STAFF })
  role: UserRole;

  @OneToMany(() => Client, (client) => client.user)
  clients?: Client[];
}

export class User extends OmitType(AuthUser, [
  'passwordHash' as const,
  'createdDate' as const,
  'updatedDate' as const,
]) {}
