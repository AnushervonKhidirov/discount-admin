import type { ExceptionMessage } from '@exception';

export class HttpException {
  status: number;
  error: string;
  message?: ExceptionMessage;

  constructor(status: number, error: string, message?: ExceptionMessage) {
    this.status = status;
    this.error = error;
    this.message = message;
  }
}
