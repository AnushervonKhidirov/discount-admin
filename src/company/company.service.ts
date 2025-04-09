import type { Company } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateCompanyDto } from './dto/create-company.dto';

import { Prisma, PrismaClient } from '@prisma/client';
import { exceptionHelper } from '@helper/exception.helper';
import { NotFoundException } from '@exception';
import { UploadService } from '../upload/upload.service';
import { UploadPath } from '../common/constant/upload';

export class CompanyService {
  private readonly repository = new PrismaClient().company;
  private readonly uploadService = new UploadService();

  async findOne(where: Prisma.CompanyWhereUniqueInput): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.repository.findUnique({ where });
      if (!company) throw new NotFoundException('Company not found');
      return [company, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async findMany(where?: Prisma.CompanyWhereInput): ReturnPromiseWithErr<Company[]> {
    try {
      const companies = await this.repository.findMany({ where });
      return [companies, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async create({ name, about }: CreateCompanyDto, userId: number): ReturnPromiseWithErr<Company> {
    try {
      const companies = await this.repository.create({ data: { name, about, userId } });
      return [companies, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async update(
    id: number,
    { name, about, logoUrl }: Partial<Company>,
    userId: number,
  ): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.repository.update({
        data: { name, about, logoUrl },
        where: { id, userId },
      });

      return [company, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async archive(id: number, userId?: number): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.repository.update({
        where: { id, userId },
        data: { archived: true },
      });
      return [company, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async unArchive(id: number, userId?: number): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.repository.update({
        where: { id, userId },
        data: { archived: false },
      });
      return [company, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Company> {
    try {
      const companies = await this.repository.delete({ where: { id } });
      return [companies, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async uploadLogo(id: number, file: File, userId: number): ReturnPromiseWithErr<Company> {
    try {
      const [company, err] = await this.findOne({ id, userId });
      if (err) throw err;

      const companyImageName = `${company.name.replaceAll(' ', '_')}_id_${company.id}`;

      const [logoUrl, logoErr] = await this.uploadService.create({
        file,
        path: UploadPath.Logo,
        fileName: companyImageName,
      });

      if (logoErr) throw logoErr;

      const updatedCompany = await this.repository.update({
        data: { logoUrl },
        where: { id, userId },
      });

      return [updatedCompany, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }
}
