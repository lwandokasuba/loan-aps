/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BodyNotEmptyPipe implements PipeTransform {
  transform(value: any) {
    // Check if the value is undefined, null, or an empty object
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      throw new BadRequestException('Request body cannot be empty.');
    }
    return value;
  }
}
