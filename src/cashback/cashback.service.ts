import type { Cashback } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateCashbackDto } from './dto/create-cashback.dto';

import { Prisma, PrismaClient } from '@prisma/client';
import { NotFoundException } from '@exception';

import { exceptionHelper } from '@helper/exception.helper';

export class CashbackService {
  private readonly repository = new PrismaClient().cashback;

  async findOne(where: Prisma.CashbackWhereUniqueInput): ReturnPromiseWithErr<Cashback> {
    try {
      const cashback = await this.repository.findUnique({ where });
      if (!cashback) throw new NotFoundException('Cashback not found');
      return [cashback, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async findMany(where?: Prisma.CashbackWhereInput): ReturnPromiseWithErr<Cashback[]> {
    try {
      const cashbacks = await this.repository.findMany({ where });
      return [cashbacks, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async create(
    { size, about, startAt, endAt, bankId }: CreateCashbackDto,
    companyId: number,
  ): ReturnPromiseWithErr<Cashback> {
    try {
      const cashback = await this.repository.create({
        data: { size, about, startAt, endAt, bankId, companyId },
      });

      return [cashback, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async update(
    id: number,
    { size, about, startAt, endAt, bankId }: Partial<Cashback>,
    companyId: number,
  ): ReturnPromiseWithErr<Cashback> {
    try {
      const cashback = await this.repository.update({
        where: { id, companyId },
        data: { size, about, startAt, endAt, bankId },
      });

      return [cashback, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async archive(id: number, companyId?: number): ReturnPromiseWithErr<Cashback> {
    try {
      const cashback = await this.repository.update({
        where: { id, companyId },
        data: { archived: true },
      });
      return [cashback, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async unarchive(id: number, companyId?: number): ReturnPromiseWithErr<Cashback> {
    try {
      const cashback = await this.repository.update({
        where: { id, companyId },
        data: { archived: false },
      });
      return [cashback, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Cashback> {
    try {
      const cashback = await this.repository.delete({ where: { id } });
      return [cashback, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }
}
