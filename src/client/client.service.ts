/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name, {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    this.logger.log(
      `Creating a new client with data: ${JSON.stringify(createClientDto)}`,
    );
    return await this.clientsRepository
      .save(createClientDto)
      .catch((error: any) => {
        this.logger.error(
          `Error creating client: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }

  async findAll() {
    this.logger.log('Fetching all clients');
    return await this.clientsRepository.find().catch((error: any) => {
      this.logger.error(
        `Error fetching clients: ${error?.message}`,
        error?.stack,
      );
      throw error;
    });
  }

  async findOne(id: string, includeLoans: boolean = false) {
    this.logger.log(`Fetching client with ID: ${id}`);
    return await this.clientsRepository
      .findOne({ where: { id }, relations: includeLoans ? ['loans'] : [] })
      .catch((error: any) => {
        this.logger.error(
          `Error fetching client with ID ${id}: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    this.logger.log(
      `Updating client with ID ${id} with data: ${JSON.stringify(updateClientDto)}`,
    );
    return await this.clientsRepository
      .update(id, updateClientDto)
      .then(() => {
        this.logger.log(`Client with ID ${id} updated successfully`);
      })
      .catch((error: any) => {
        this.logger.error(
          `Error updating client with ID ${id}: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }

  async remove(id: string) {
    this.logger.log(`Removing client with ID: ${id}`);
    return await this.clientsRepository
      .delete(id)
      .then(() => {
        this.logger.log(`Client with ID ${id} removed successfully`);
      })
      .catch((error: any) => {
        this.logger.error(
          `Error removing client with ID ${id}: ${error?.message}`,
          error?.stack,
        );
        throw error;
      });
  }
}
