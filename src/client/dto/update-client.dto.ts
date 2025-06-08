import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { ApiProperty } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty()
  id: string;
}
