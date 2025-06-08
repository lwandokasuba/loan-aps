/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan, LoanStatus } from './entities/loan.entity';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name, {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    this.logger.log(
      `Creating a new loan with data: ${JSON.stringify(createLoanDto)}`,
    );
    return await this.loansRepository.manager
      .transaction(async (transaction) => {
        const client = await transaction.findOne(Client, {
          where: { id: createLoanDto.client_id },
          relations: { loans: true },
        });

        if (!client) {
          throw new Error(
            `loan with client ID ${createLoanDto.client_id} not found.`,
          );
        }

        if (
          createLoanDto.status === LoanStatus.ACTIVE &&
          client?.loans?.some((loan) => loan.status === LoanStatus.ACTIVE)
        ) {
          throw new Error(
            'Client already has an active loan. Cannot create loan with status active',
          );
        }

        return await transaction.save(Loan, createLoanDto);
      })
      .catch((error: any) => {
        const message = `Error creating loan: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
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

    return await this.loansRepository.manager
      .transaction(async (transaction) => {
        const loan = await transaction.findOne(Loan, {
          where: { id },
          relations: { client: true },
        });

        if (!loan) {
          throw new Error(`loan with ID ${id} not found.`);
        }

        if (!loan?.client_id || !loan?.client) {
          throw new Error(`loan with ID ${id} does not have a client.`);
        }

        if (updateLoanDto?.status === LoanStatus.ACTIVE) {
          const activeLoans = await transaction.find(Loan, {
            where: { status: LoanStatus.ACTIVE, client_id: loan.client_id },
          });

          if (activeLoans?.length > 0) {
            throw new Error(
              'Client already has an active loan. Cannot update loan to active',
            );
          }
        }

        if (updateLoanDto?.amount) {
          loan.amount = updateLoanDto.amount;
        }
        if (updateLoanDto?.interest_rate) {
          loan.interest_rate = updateLoanDto.interest_rate;
        }
        if (updateLoanDto?.status) {
          loan.status = updateLoanDto.status;
        }

        return await transaction.save(Loan, loan);
      })
      .then((loan) => {
        this.logger.log(`Loan with ID ${id} updated successfully`);
        return loan;
      })
      .catch((error) => {
        const message = `Error updating loan with ID ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
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
