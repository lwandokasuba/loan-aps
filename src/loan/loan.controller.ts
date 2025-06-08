import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { TransformInterceptor } from 'src/utils/interceptors';
import { BodyNotEmptyPipe } from 'src/utils/body-not-empty.pipe';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoanStatus } from './entities/loan.entity';

@Controller('loan')
@UseInterceptors(TransformInterceptor)
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiResponse({
    status: 200,
    description: 'The loan has been successfully created.',
  })
  async create(@Body() createLoanDto: CreateLoanDto) {
    return await this.loanService.create(createLoanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all loans' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all loans.',
  })
  async findAll() {
    return await this.loanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a loan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the loan.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.loanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a loan by ID' })
  @ApiResponse({
    status: 200,
    description: 'The loan has been successfully updated.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(BodyNotEmptyPipe) updateLoanDto: UpdateLoanDto,
  ) {
    if (updateLoanDto.status === LoanStatus.ACTIVE) {
      const activeLoans = await this.loanService.findActive(id);
      if (activeLoans?.length > 1) {
        const message = `Client already has ${activeLoans?.length} ${activeLoans?.length === 1 ? 'loan' : 'loans'} active`;
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: message,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: message,
          },
        );
      }
    }
    return await this.loanService.update(id, updateLoanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a loan by ID' })
  @ApiResponse({
    status: 200,
    description: 'The loan has been successfully deleted.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.loanService.remove(id);
  }
}
