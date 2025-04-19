import { logger } from '@config/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@exception';

export function exceptionHandler(err: unknown): [null, HttpException] {
  if (err instanceof PrismaClientKnownRequestError) {
    const exception = prismaException(err);
    if (exception) return [null, exception];
  }

  const isHttpException = err instanceof HttpException;
  if (!isHttpException) logger.error(err);

  const exception = isHttpException ? err : new InternalServerErrorException();
  return [null, exception];
}

function prismaException(err: PrismaClientKnownRequestError) {
  const codes: { [key: string]: HttpException } = {
    P2002: new ConflictException(),
    P2025: new NotFoundException(),
    P2003: new NotFoundException(getFieldName(err.meta?.field_name, 'not found')),
  };

  if (codes[err.code]) return codes[err.code];
}

function getFieldName(field?: unknown, additionalText?: string) {
  if (typeof field !== 'string' || field.length === 0) return;
  const firstLatter = field[0]?.toUpperCase();
  return `${firstLatter}${field.slice(1)} ${additionalText}`.replace('_id', '');
}
