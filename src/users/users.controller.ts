import {
  Controller,
  Get,
  Param,
  Delete,
  UseInterceptors,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransformInterceptor } from 'src/utils/interceptors';
import { UsersService } from './users.service';
import { AdminRoleGuard } from 'src/auth/roles.guard';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
@UseGuards(AdminRoleGuard)
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users.',
  })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id);
  }

  @Get(':id/clients')
  @ApiOperation({ summary: 'Retrieve a user by ID with their clients' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user with their clients.',
  })
  async findOneWithLoans(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.remove(id);
  }
}
