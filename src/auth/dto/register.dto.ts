import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { UserRole } from 'src/users/entities/users.entity';
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class RegisterDto extends LoginDto {
  @ApiProperty({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
