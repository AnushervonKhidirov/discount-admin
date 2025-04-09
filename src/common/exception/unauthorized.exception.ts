import type { ExceptionMessage } from '@exception';
import { HttpException } from '@exception';

export class UnauthorizedException extends HttpException {
  constructor(message?: ExceptionMessage) {
    super(401, 'Unauthorized', message);
  }
}
