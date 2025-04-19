import type { User } from '@prisma/client';
import type { Tokens, UserTokenPayload } from '../token/token.type';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateUserDto } from '../user/dto/create-user.dto';
import type { SignInDto } from './dto/sign-in.dto';
import type { SignOutDto } from './dto/sign-out.dto';
import type { RefreshTokenDto } from './dto/refresh-token.dto';

import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
} from '@exception';
import { exceptionHandler } from '@helper/exception.helper';

export class AuthService {
  private readonly userService = new UserService();
  private readonly tokenService = new TokenService();

  async signUp(createUserDto: CreateUserDto): ReturnPromiseWithErr<Tokens> {
    try {
      const [user, err] = await this.userService.create(createUserDto);
      if (err) throw err;

      const [token, tokenErr] = await this.createTokens(user);
      if (tokenErr) throw tokenErr;

      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signIn({ username, password }: SignInDto): ReturnPromiseWithErr<Tokens> {
    try {
      const [user, err] = await this.userService.findOne({ username }, true);
      if (err) throw err;

      if (user.role === 'USER') throw new ForbiddenException('Access denied');

      const isPasswordCorrect = await Bun.password.verify(password, user.password);
      if (!isPasswordCorrect) throw new BadRequestException('Wrong password');

      const [token, tokenErr] = await this.createTokens(user);
      if (tokenErr) throw tokenErr;
      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signOut({ refreshToken }: SignOutDto): Promise<void | HttpException> {
    try {
      const [_, tokenErr] = this.tokenService.verifyRefreshToken(refreshToken);
      if (tokenErr) throw tokenErr;

      const [__, deleteErr] = await this.tokenService.delete(refreshToken);
      if (deleteErr) throw deleteErr;
    } catch (err) {
      const error = err instanceof HttpException ? err : new InternalServerErrorException();
      return error;
    }
  }

  async signOutEverywhere({ refreshToken }: SignOutDto): Promise<void | HttpException> {
    try {
      const [token, err] = this.tokenService.verifyRefreshToken(refreshToken);
      if (err) throw err;

      if (!token.sub || !token.username || !token.role) throw new Error('Invalid token payload');

      const userData = {
        id: +token.sub,
        username: token.username,
        role: token.role,
      };

      const [_, deleteErr] = await this.tokenService.deleteAllUsersToken(userData.id);
      if (deleteErr) throw deleteErr;
    } catch (err) {
      const error = err instanceof HttpException ? err : new InternalServerErrorException();
      return error;
    }
  }

  async refreshToken({ refreshToken }: RefreshTokenDto): ReturnPromiseWithErr<Tokens> {
    try {
      const [_, verifyErr] = this.tokenService.verifyRefreshToken(refreshToken);
      if (verifyErr) throw verifyErr;

      const [deletedToken, deleteErr] = await this.tokenService.delete(refreshToken);
      if (deleteErr) throw deleteErr;

      const [token, tokenErr] = await this.createTokens(deletedToken.user);
      if (tokenErr) throw tokenErr;

      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private async createTokens(user: Omit<User, 'password'>): ReturnPromiseWithErr<Tokens> {
    const payload: UserTokenPayload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    };

    const [token, tokenErr] = this.tokenService.generate(payload);
    if (tokenErr) return [null, tokenErr];

    const [_, saveTokenErr] = await this.tokenService.save(user.id, token.refreshToken);
    if (saveTokenErr) return [null, saveTokenErr];

    return [token, null];
  }
}
