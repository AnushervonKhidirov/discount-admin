import type { ExceptionMessage } from '@exception';
import { HttpException } from '@exception';

export class BadRequestException extends HttpException {
  constructor(message?: ExceptionMessage) {
    super(400, 'Bad Request', message);
  }
}
