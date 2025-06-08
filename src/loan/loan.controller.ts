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
  UseGuards,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { TransformInterceptor } from 'src/utils/interceptors';
import { BodyNotEmptyPipe } from 'src/utils/body-not-empty.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRoleGuard } from 'src/auth/roles.guard';

@ApiBearerAuth()
@ApiTags('Loan')
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
  @UseGuards(AdminRoleGuard)
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
