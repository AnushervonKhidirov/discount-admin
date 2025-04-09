import { HttpException } from '@exception';

export class ForbiddenException extends HttpException {
  constructor(message?: string | string[]) {
    super(403, 'Forbidden', message);
  }
}
