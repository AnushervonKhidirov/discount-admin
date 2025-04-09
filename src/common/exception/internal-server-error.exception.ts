import type { ExceptionMessage } from '@exception';
import { HttpException } from '@exception';

export class InternalServerErrorException extends HttpException {
  constructor(message?: ExceptionMessage) {
    super(500, 'Internal Server Error', message);
  }
}
