/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Session } from 'src/types';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, {
    timestamp: true,
  });

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.login(
        loginDto.username,
        loginDto.password,
      );

      if (!user) {
        throw new Error('No user');
      }

      const access_token = this.jwtService.sign(user);
      return {
        access_token,
        createdDate: new Date(),
        expiresIn: process.env.AUTH_EXPIRES,
      } as Session;
    } catch (error) {
      const message = `Failed to login`;
      this.logger.error(message, error?.stack);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.create(
      registerDto.username,
      registerDto.password,
      registerDto.role,
    );
  }
}
