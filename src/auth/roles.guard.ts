/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../users/entities/users.entity';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();

    const request = ctx.getRequest();

    if (request?.user?.role === UserRole.ADMIN) return true;
    else
      throw new HttpException('Only Admins can access', HttpStatus.FORBIDDEN);
  }
}
