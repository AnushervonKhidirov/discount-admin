import type { Discount } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateDiscountDto } from './dto/create-discount.dto';

import { Prisma, PrismaClient } from '@prisma/client';
import { NotFoundException } from '@exception';

import { exceptionHelper } from '@helper/exception.helper';

export class DiscountService {
  private readonly repository = new PrismaClient().discount;

  async findOne(where: Prisma.DiscountWhereUniqueInput): ReturnPromiseWithErr<Discount> {
    try {
      const discount = await this.repository.findUnique({ where });
      if (!discount) throw new NotFoundException('Discount not found');
      return [discount, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async findMany(where?: Prisma.DiscountWhereInput): ReturnPromiseWithErr<Discount[]> {
    try {
      const discounts = await this.repository.findMany({ where });
      return [discounts, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async create(
    { size, about, startAt, endAt }: CreateDiscountDto,
    companyId: number,
  ): ReturnPromiseWithErr<Discount> {
    try {
      const discount = await this.repository.create({
        data: { size, about, startAt, endAt, companyId },
      });

      return [discount, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async update(
    id: number,
    { size, about, startAt, endAt }: Partial<Discount>,
    companyId: number,
  ): ReturnPromiseWithErr<Discount> {
    try {
      const discount = await this.repository.update({
        where: { id, companyId },
        data: { size, about, startAt, endAt },
      });

      return [discount, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async archive(id: number, companyId?: number): ReturnPromiseWithErr<Discount> {
    try {
      const discount = await this.repository.update({
        where: { id, companyId },
        data: { archived: true },
      });
      return [discount, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async unarchive(id: number, companyId?: number): ReturnPromiseWithErr<Discount> {
    try {
      const discount = await this.repository.update({
        where: { id, companyId },
        data: { archived: false },
      });
      return [discount, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Discount> {
    try {
      const discount = await this.repository.delete({ where: { id } });
      return [discount, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }
}
