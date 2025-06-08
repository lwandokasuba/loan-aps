/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { AuthUser, User, UserRole } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  comparePassword,
  generatePasswordHashAndSalt,
} from 'src/utils/password';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, {
    timestamp: true,
  });

  constructor(
    @InjectRepository(AuthUser)
    private usersRepository: Repository<AuthUser>,
  ) {}

  async create(username: string, password: string, role: UserRole) {
    const { passwordHash } = await generatePasswordHashAndSalt(password);

    return await this.usersRepository
      .save({ username, passwordHash, role })
      .catch((error: any) => {
        const message = `Error creating user: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }

  async login(username: string, password: string): Promise<User | undefined> {
    const authUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (!authUser?.passwordHash) {
      const message = 'User not found.';
      throw new Error(message);
    }

    return await comparePassword(password, authUser.passwordHash)
      .then((value) => {
        if (value) {
          return {
            id: authUser.id,
            username: authUser.username,
            role: authUser.role,
          } as User;
        } else {
          throw new Error('Wrong Password');
        }
      })
      .catch((error) => {
        const message = `Error user: failed to get user, ${error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw error;
      });
  }

  async findAll() {
    this.logger.log('Fetching all users');
    return await this.usersRepository.find().catch((error: any) => {
      const message = `Error fetching users: ${error?.detail ?? error?.message}`;
      this.logger.error(message, JSON.stringify(error));
      throw new Error(message);
    });
  }

  async findOne(id: string, includeClients: boolean = false) {
    this.logger.log(`Fetching user with ID: ${id}`);
    return await this.usersRepository
      .findOne({ where: { id }, relations: includeClients ? ['clients'] : [] })
      .catch((error: any) => {
        const message = `Error fetching user with ID ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }

  async remove(id: string) {
    this.logger.log(`Removing user with ID: ${id}`);
    return await this.usersRepository
      .delete(id)
      .then((result) => {
        if (result?.affected === 0) {
          throw new Error('No changes made.');
        }
        this.logger.log(
          `User with ID ${id} removed successfully, ${result?.affected} affected`,
        );
      })
      .catch((error: any) => {
        const message = `Error removing user with ID ${id}: ${error?.detail ?? error?.message}`;
        this.logger.error(message, JSON.stringify(error));
        throw new Error(message);
      });
  }
}
