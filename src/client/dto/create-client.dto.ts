import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}\/\d{2}\/\d{1}$/, {
    message: 'National ID must be in the format XXXXXX/YY/Z',
  })
  national_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone('en-ZM')
  phone_number: string;
}
