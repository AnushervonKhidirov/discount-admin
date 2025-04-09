import { HttpException } from './http.exception';
import { NotFoundException } from './not-found.exception';
import { BadRequestException } from './bad-request.exception';
import { UnauthorizedException } from './unauthorized.exception';
import { InternalServerErrorException } from './internal-server-error.exception';
import { ConflictException } from './conflict.exception';
import { ForbiddenException } from './forbidden.exception';

export type ExceptionMessage = string | string[];

export {
  HttpException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
  ForbiddenException,
};
