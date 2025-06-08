import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { TransformInterceptor } from 'src/utils/interceptors';

@ApiBearerAuth()
@ApiTags('Client')
@Controller('client')
@UseInterceptors(TransformInterceptor)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'The client has been successfully created.',
  })
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all clients' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all clients.',
  })
  async findAll() {
    return await this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the client.',
  })
  async findOne(@Param('id') id: string) {
    return await this.clientService.findOne(id);
  }

  @Get(':id/loans')
  @ApiOperation({ summary: 'Retrieve a client by ID with their loans' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the client with their loans.',
  })
  async findOneWithLoans(@Param('id') id: string) {
    return await this.clientService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'The client has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'The client has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return await this.clientService.remove(id);
  }
}
