/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan, LoanStatus } from './entities/loan.entity';
import { Client } from '../client/entities/client.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../users/entities/users.entity';

@Injectable({ scope: Scope.REQUEST })
export class LoanService {
  private readonly logger = new Logger(LoanService.name, {
    timestamp: true,
  });

  constructor(
    @Inject(REQUEST) private request: Request & { user: User },
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
    private dataSource: DataSource,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    this.logger.log(
      `Creating a new loan with data: ${JSON.stringify(createLoanDto)}`,
    );
    let loan: Loan;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const client = await queryRunner.manager.findOne(Client, {
        where: { id: createLoanDto.client_id },
        relations: { loans: true },
      });

      if (!client) {
        throw new Error(
          `loan with client ID ${createLoanDto.client_id} not found.`,
        );
      }

      if (client?.user_id !== this.request.user?.id) {
        throw new Error(`This user can not create a loan for this client'`);
      }

      if (
        createLoanDto.status === LoanStatus.ACTIVE &&
        client?.loans?.some((loan) => loan.status === LoanStatus.ACTIVE)
      ) {
        throw new Error(
          'Client already has an active loan. Cannot create loan with status active',
        );
      }

      loan = await queryRunner.manager.save(Loan, createLoanDto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const message = `Error creating loan: ${error?.detail ?? error?.message}`;
      this.logger.error(message, JSON.stringify(error));
      throw new Error(message);
    } finally {
      await queryRunner.release();
    }

    return loan;
  }

  async findAll() {
    this.logger.log('Fetching all loans');
    return await this.loansRepository.find().catch((error: any) => {
      const message = `Error fetching loans: ${error?.detail ?? error?.message}`;
      this.logger.error(message, JSON.stringify(error));
      throw new Error(message);
    });
  }

  async findActive(id: string) {
    this.logger.log(`Fetching all active loans for ${id}`);
    return await this.loansRepository
      .find({ where: { status: LoanStatus.ACTIVE, id } })
      .catch((error: any) => {
        const message = `Error fetching active loans for ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }

  async findOne(id: string) {
    this.logger.log(`Fetching loan with ID: ${id}`);
    return await this.loansRepository
      .findOne({ where: { id } })
      .catch((error: any) => {
        const message = `Error fetching loan with ID ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    this.logger.log(
      `Updating loan with ID ${id} with data: ${JSON.stringify(updateLoanDto)}`,
    );

    let loan: Loan;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentLoan = await queryRunner.manager.findOne(Loan, {
        where: { id },
        relations: { client: true },
      });

      if (!currentLoan) {
        throw new Error(`loan with ID ${id} not found.`);
      }

      if (!currentLoan?.client_id || !currentLoan?.client) {
        throw new Error(`loan with ID ${id} does not have a client.`);
      }

      if (updateLoanDto?.status === LoanStatus.ACTIVE) {
        const activeLoans = await queryRunner.manager.find(Loan, {
          where: {
            status: LoanStatus.ACTIVE,
            client_id: currentLoan.client_id,
          },
        });

        if (activeLoans?.length > 0) {
          throw new Error(
            'Client already has an active loan. Cannot update loan to active',
          );
        }
      }

      if (updateLoanDto?.amount) {
        currentLoan.amount = updateLoanDto.amount;
      }
      if (updateLoanDto?.interest_rate) {
        currentLoan.interest_rate = updateLoanDto.interest_rate;
      }
      if (updateLoanDto?.status) {
        currentLoan.status = updateLoanDto.status;
      }

      loan = await queryRunner.manager.save(Loan, currentLoan);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const message = `Error creating loan: ${error?.detail ?? error?.message}`;
      this.logger.error(message, JSON.stringify(error));
      throw new Error(message);
    } finally {
      await queryRunner.release();
    }

    return loan;
  }

  async remove(id: string) {
    this.logger.log(`Removing loan with ID: ${id}`);
    return await this.loansRepository
      .delete(id)
      .then((result) => {
        if (result?.affected === 0) {
          throw new Error('No changes made.');
        }
        this.logger.log(
          `Loan with ID ${id} removed successfully, ${result?.affected} affected`,
        );
      })
      .catch((error: any) => {
        const message = `Error removing loan with ID ${id}:${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }
}
