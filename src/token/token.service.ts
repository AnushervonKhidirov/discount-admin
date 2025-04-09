import type { JwtPayload } from 'jsonwebtoken';
import type { Prisma, User, Token as UserToken } from '@prisma/client';
import type { Tokens } from './token.type';
import type { ReturnWithErr, ReturnPromiseWithErr } from '@type/return-with-error.type';

import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { exceptionHelper } from '@helper/exception.helper';
import { UnauthorizedException } from '@exception';

export class TokenService {
  private readonly repository = new PrismaClient().token;
  private readonly accessKey = process.env.ACCESS_TOKEN_SECRET;
  private readonly refreshKey = process.env.REFRESH_TOKEN_SECRET;

  generate(payload: JwtPayload): ReturnWithErr<Tokens> {
    try {
      if (!this.accessKey || !this.refreshKey) {
        throw new Error('Access/Refresh token keys not found');
      }

      const accessToken = sign(payload, this.accessKey, { expiresIn: '10m' });
      const refreshToken = sign(payload, this.refreshKey, { expiresIn: '10h' });

      return [{ accessToken, refreshToken }, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async save(userId: number, refreshToken: string): ReturnPromiseWithErr<UserToken> {
    try {
      const expiredAt = new Date();
      expiredAt.setHours(expiredAt.getHours() + 10);

      const token = await this.repository.create({ data: { refreshToken, userId, expiredAt } });
      return [token, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(
    refreshToken: string,
  ): ReturnPromiseWithErr<UserToken & { user: Omit<User, 'password'> }> {
    try {
      const token = await this.repository.delete({
        where: { refreshToken },
        include: { user: { omit: { password: true } } },
      });
      return [token, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async deleteAllUsersToken(userId: number): ReturnPromiseWithErr<Prisma.BatchPayload> {
    try {
      const token = await this.repository.deleteMany({ where: { userId } });
      return [token, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  verifyAccessToken(accessToken: string): ReturnWithErr<JwtPayload> {
    try {
      if (!this.accessKey) throw new Error('Access token key not found');
      const userPayload = verify(accessToken, this.accessKey);
      if (typeof userPayload === 'string') throw new Error('Payload is a string');
      return [userPayload, null];
    } catch (err) {
      return exceptionHelper(new UnauthorizedException('Invalid token'), true);
    }
  }

  verifyRefreshToken(refreshToken: string): ReturnWithErr<JwtPayload> {
    try {
      if (!this.refreshKey) throw new Error('Refresh token key not found');
      const userPayload = verify(refreshToken, this.refreshKey);
      if (typeof userPayload === 'string') throw new Error('Payload is a string');
      return [userPayload, null];
    } catch (err) {
      return exceptionHelper(new UnauthorizedException('Invalid token'), true);
    }
  }
}
