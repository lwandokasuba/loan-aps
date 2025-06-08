import { ApiProperty } from '@nestjs/swagger';
export class CreateClientDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  national_id: string;
  @ApiProperty()
  phone_number: string;
}
