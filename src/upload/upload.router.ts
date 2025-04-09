import Elysia, { t } from 'elysia';
import { UploadService } from './upload.service';
import { UploadPath } from '../common/constant/upload';

export const uploadRouter = new Elysia();
const uploadService = new UploadService();

uploadRouter.get(
  `${UploadPath.Logo}/:file`,
  async ({ params, error }) => {
    const [file, err] = await uploadService.get(UploadPath.Logo, params.file);
    if (err) throw error(err.status, { ...err });
    return file;
  },
  { params: t.Object({ file: t.String() }) },
);
