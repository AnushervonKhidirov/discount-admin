import type { ExceptionMessage } from '@exception';
import { HttpException } from '@exception';

export class ConflictException extends HttpException {
  constructor(message?: ExceptionMessage) {
    super(409, 'Conflict', message);
  }
}
