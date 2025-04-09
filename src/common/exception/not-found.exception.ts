import type { ExceptionMessage } from '@exception';
import { HttpException } from '@exception';

export class NotFoundException extends HttpException {
  constructor(message?: ExceptionMessage) {
    super(404, 'Not Found', message);
  }
}
