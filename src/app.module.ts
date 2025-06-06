import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { Client } from './client/entities/client.entity';
import { LoanModule } from './loan/loan.module';
import { Loan } from './loan/entities/loan.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'mydatabase',
      entities: [Client, Loan],
      logging: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ClientModule,
    LoanModule,
  ],
})
export class AppModule {}
