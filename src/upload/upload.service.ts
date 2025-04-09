import type { UploadDto } from './dto/upload.dto';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { ElysiaFile, file } from 'elysia';
import { exists, writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { InternalServerErrorException, NotFoundException } from '@exception';
import { exceptionHelper } from '@helper/exception.helper';

export class UploadService {
  async get(path: string, fileName: string): ReturnPromiseWithErr<ElysiaFile> {
    try {
      const fullPath = join(process.cwd(), path, fileName);
      const isExist = await exists(fullPath);
      if (!isExist) throw new NotFoundException('File not found');
      return [file(fullPath), null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async create({ file, path, fileName }: UploadDto): ReturnPromiseWithErr<string> {
    try {
      const format = file.name.split('.').at(-1);
      if (!format) throw new InternalServerErrorException('Unable to save file');

      const fullPath = join(process.cwd(), path);

      await this.createFolderIfNotExist(fullPath);

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const name = `${fileName}-${uuid()}.${format}`;

      await writeFile(join(fullPath, name), fileBuffer);
      return [join(path, name), null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(path: string, fileName: string): ReturnPromiseWithErr<unknown> {
    try {
      const fullPath = join(process.cwd(), path, fileName);
      const isExist = await exists(fullPath);
      if (!isExist) throw new NotFoundException('File not found');
      await unlink(fullPath);
      return [{}, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  private async createFolderIfNotExist(path: string) {
    const isFolderExist = await exists(path);
    if (!isFolderExist) await mkdir(path, { recursive: true });
  }
}
