/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';

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
    return await this.loansRepository
      .save(createLoanDto)
      .catch((error: any) => {
        this.logger.error(
          `Error creating loan: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }

  async findAll() {
    this.logger.log('Fetching all loans');
    return await this.loansRepository.find().catch((error: any) => {
      this.logger.error(
        `Error fetching loans: ${error?.message}`,
        error?.stack,
      );
      throw error;
    });
  }

  async findOne(id: string) {
    this.logger.log(`Fetching loan with ID: ${id}`);
    return await this.loansRepository
      .findOne({ where: { id } })
      .catch((error: any) => {
        this.logger.error(
          `Error fetching loan with ID ${id}: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    this.logger.log(
      `Updating loan with ID ${id} with data: ${JSON.stringify(updateLoanDto)}`,
    );
    return await this.loansRepository
      .update(id, updateLoanDto)
      .then(() => this.findOne(id))
      .catch((error: any) => {
        this.logger.error(
          `Error updating loan with ID ${id}: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }

  async remove(id: string) {
    this.logger.log(`Removing loan with ID: ${id}`);
    return await this.loansRepository
      .delete(id)
      .then(() => ({ message: `Loan with ID ${id} removed successfully` }))
      .catch((error: any) => {
        this.logger.error(
          `Error removing loan with ID ${id}: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }
}
