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
        const message = `Error creating client: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }

  async findAll() {
    this.logger.log('Fetching all clients');
    return await this.clientsRepository.find().catch((error: any) => {
      const message = `Error fetching clients: ${error?.detail ?? error?.message}`;
      this.logger.error(message, JSON.stringify(error));
      throw new Error(message);
    });
  }

  async findOne(id: string, includeLoans: boolean = false) {
    this.logger.log(`Fetching client with ID: ${id}`);
    return await this.clientsRepository
      .findOne({ where: { id }, relations: includeLoans ? ['loans'] : [] })
      .catch((error: any) => {
        const message = `Error fetching client with ID ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    this.logger.log(
      `Updating client with ID ${id} with data: ${JSON.stringify(updateClientDto)}`,
    );
    return await this.clientsRepository
      .update(id, updateClientDto)
      .then(async (result) => {
        if (result?.affected === 0) {
          throw new Error('No changes made.');
        }
        this.logger.log(
          `Client with ID ${id} updated successfully, ${result.affected} affected`,
        );
        return await this.findOne(id);
      })
      .catch((error: any) => {
        const message = `Error updating client with ID ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }

  async remove(id: string) {
    this.logger.log(`Removing client with ID: ${id}`);
    return await this.clientsRepository
      .delete(id)
      .then((result) => {
        if (result?.affected === 0) {
          throw new Error('No changes made.');
        }
        this.logger.log(
          `Client with ID ${id} removed successfully, ${result?.affected} affected`,
        );
      })
      .catch((error: any) => {
        const message = `Error removing client with ID ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }
}
