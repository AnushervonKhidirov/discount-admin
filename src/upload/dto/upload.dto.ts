import { t } from 'elysia';

export const uploadBody = t.Object({
  file: t.File({ format: 'image/*' }),
});

export type UploadDto = typeof uploadBody.static & { path: string, fileName: string };
