import type { Prisma, User } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateUserDto } from './dto/create-user.dto';

import { PrismaClient } from '@prisma/client';
import { exceptionHelper } from '@helper/exception.helper';
import { NotFoundException } from '@exception';

export class UserService {
  private readonly repository = new PrismaClient().user;

  async findOne<T extends boolean>(
    where: Prisma.UserWhereUniqueInput,
    withPassword?: T,
  ): ReturnPromiseWithErr<T extends true ? User : Omit<User, 'password'>> {
    try {
      const user = await this.repository.findUnique({ where, omit: { password: !withPassword } });
      if (!user) throw new NotFoundException('User not found');
      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async findMany(where?: Prisma.UserWhereInput): ReturnPromiseWithErr<Omit<User, 'password'>[]> {
    try {
      const users = await this.repository.findMany({ where, omit: { password: true } });
      return [users, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async create({
    username,
    password,
  }: CreateUserDto): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const hashedPassword = await Bun.password.hash(password, 'bcrypt');

      const user = await this.repository.create({
        data: { username, password: hashedPassword },
        omit: { password: true },
      });
      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async update(
    id: number,
    { username, password }: Partial<User>,
  ): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const hashedPassword = password && (await Bun.password.hash(password, 'bcrypt'));

      const user = await this.repository.update({
        data: { username, password: hashedPassword },
        where: { id },
        omit: { password: true },
      });
      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async archive(id: number): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const user = await this.repository.update({
        data: { archived: true },
        where: { id },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async unArchive(id: number): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const user = await this.repository.update({
        data: { archived: false },
        where: { id },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const deletedUser = await this.repository.delete({ where: { id }, omit: { password: true } });
      return [deletedUser, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }
}
