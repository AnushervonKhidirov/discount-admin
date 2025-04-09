import type { Bank, Prisma } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateBankDto } from './dto/create-bank.dto';

import { PrismaClient } from '@prisma/client';
import { exceptionHelper } from '@helper/exception.helper';
import { ConflictException, NotFoundException } from '@exception';
import { UploadService } from '../upload/upload.service';
import { UploadPath } from '../common/constant/upload';

export class BankService {
  private readonly repository = new PrismaClient().bank;
  private readonly uploadService = new UploadService();

  async findOne(where: Prisma.BankWhereUniqueInput): ReturnPromiseWithErr<Bank> {
    try {
      const bank = await this.repository.findUnique({ where });
      if (!bank) throw new NotFoundException('Bank not found');
      return [bank, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async findMany(where?: Prisma.BankWhereInput): ReturnPromiseWithErr<Bank[]> {
    try {
      const banks = await this.repository.findMany({ where });
      return [banks, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async create(createBankDto: CreateBankDto): ReturnPromiseWithErr<Bank> {
    try {
      const [isExist] = await this.findOne({ name: createBankDto.name });
      if (isExist) throw new ConflictException(`Bank '${createBankDto.name}' already exists`);

      const bank = await this.repository.create({ data: createBankDto });
      return [bank, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async update(id: number, updateBankDto: Partial<Bank>): ReturnPromiseWithErr<Bank> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) throw err;

      const bank = await this.repository.update({ data: updateBankDto, where: { id } });
      return [bank, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async archive(id: number): ReturnPromiseWithErr<Bank> {
    try {
      const [bank, err] = await this.update(id, { archived: true });
      if (err) throw err;
      return [bank, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async unArchive(id: number): ReturnPromiseWithErr<Bank> {
    try {
      const [bank, err] = await this.update(id, { archived: false });
      if (err) throw err;
      return [bank, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Bank> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) throw err;

      const bank = await this.repository.delete({ where: { id } });
      return [bank, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async uploadLogo(id: number, file: File): ReturnPromiseWithErr<Bank> {
    try {
      const [bank, err] = await this.findOne({ id });
      if (err) throw err;

      const bankImageName = `${bank.name.replaceAll(' ', '_')}_id_${bank.id}`;

      const [logoUrl, logoErr] = await this.uploadService.create({
        file,
        path: UploadPath.Logo,
        fileName: bankImageName,
      });

      if (logoErr) throw logoErr;

      const [updatedBank, updateErr] = await this.update(id, { logoUrl });
      if (updateErr) throw updateErr;

      return [updatedBank, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }
}
