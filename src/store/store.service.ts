import type { Prisma, Store } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { createStoreDto } from './dto/cerate-store.dto';

import { PrismaClient } from '@prisma/client';
import { exceptionHelper } from '@helper/exception.helper';
import { NotFoundException } from '@exception';

export class StoreService {
  private readonly repository = new PrismaClient().store;

  async findOne(where: Prisma.StoreWhereUniqueInput): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.repository.findUnique({ where });
      if (!store) throw new NotFoundException('Store not found');
      return [store, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async findMany(where?: Prisma.StoreWhereInput): ReturnPromiseWithErr<Store[]> {
    try {
      const stores = await this.repository.findMany({ where });
      return [stores, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async create(
    { latitude, longitude, openAt, closeAt }: createStoreDto,
    companyId: number,
  ): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.repository.create({
        data: { latitude, longitude, openAt, closeAt, companyId },
      });

      return [store, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async update(
    id: number,
    { latitude, longitude, openAt, closeAt }: Partial<Store>,
    companyId: number,
  ): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.repository.update({
        where: { id, companyId },
        data: { latitude, longitude, openAt, closeAt },
      });

      return [store, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async archive(id: number, companyId?: number): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.repository.update({
        where: { id, companyId },
        data: { archived: true },
      });

      return [store, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async unarchive(id: number, companyId?: number): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.repository.update({
        where: { id, companyId },
        data: { archived: false },
      });

      return [store, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.repository.delete({ where: { id } });
      return [store, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }
}
