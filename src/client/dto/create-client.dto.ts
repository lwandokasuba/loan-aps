/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, Matches } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{6}\/\d{2}\/\d{1}$/, {
    message: 'National ID must be in the format XXXXXX/YY/Z',
  })
  national_id: string;

  @ApiProperty()
  @IsMobilePhone('en-ZM')
  phone_number: string;
}
