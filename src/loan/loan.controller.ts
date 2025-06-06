import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async create(@Body() createLoanDto: CreateLoanDto) {
    return await this.loanService.create(createLoanDto);
  }

  @Get()
  async findAll() {
    return await this.loanService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.loanService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return await this.loanService.update(id, updateLoanDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.loanService.remove(id);
  }
}
