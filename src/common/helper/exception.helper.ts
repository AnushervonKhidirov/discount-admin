import { logger } from '@config/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@exception';

export function exceptionHelper(err: unknown, logError?: boolean): [null, HttpException] {
  const isHttpException = err instanceof HttpException;
  if (logError && !isHttpException) logger.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    const exception = prismaException(err);
    if (exception) return [null, exception];
  }

  const exception = isHttpException ? err : new InternalServerErrorException();
  return [null, exception];
}

function prismaException(err: PrismaClientKnownRequestError) {
  const codes: { [key: string]: HttpException } = {
    P2002: new ConflictException(),
    P2025: new NotFoundException(),
  };

  if (codes[err.code]) return codes[err.code];
}
