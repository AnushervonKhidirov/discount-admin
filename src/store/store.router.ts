import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
import { StoreService } from './store.service';

import { createStoreBody } from './dto/cerate-store.dto';
import { updateStoreBody } from './dto/update-store.dto';

export const storeRouter = new Elysia({ prefix: 'stores' });
const storeService = new StoreService();

storeRouter
  .use(authMiddleware)
  .get('/', async ({ error }) => {
    const [stores, err] = await storeService.findMany();
    if (err) throw error(err.status, { ...err });
    return stores;
  })
  .get(
    '/:id',
    async ({ params, error }) => {
      const [companyStores, err] = await storeService.findOne({ id: params.id });
      if (err) throw error(err.status, { ...err });
      return companyStores;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .post(
    '/',
    async ({ body, query, error }) => {
      const [companyStore, storeErr] = await storeService.create(body, query.companyId);
      if (storeErr) throw error(storeErr.status, { ...storeErr });
      return companyStore;
    },
    { body: createStoreBody, query: t.Object({ companyId: t.Number() }) },
  )
  .put(
    '/:id',
    async ({ body, params, query, error }) => {
      const [companyStore, storeErr] = await storeService.update(params.id, body, query.companyId);
      if (storeErr) throw error(storeErr.status, { ...storeErr });
      return companyStore;
    },
    {
      body: updateStoreBody,
      params: t.Object({ id: t.Number() }),
      query: t.Object({ companyId: t.Number() }),
    },
  )
  .patch(
    '/archive/:id',
    async ({ params, error }) => {
      const [companyStore, storeErr] = await storeService.archive(params.id);
      if (storeErr) throw error(storeErr.status, { ...storeErr });
      return companyStore;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .patch(
    '/unarchive/:id',
    async ({ params, error }) => {
      const [companyStore, storeErr] = await storeService.unarchive(params.id);
      if (storeErr) throw error(storeErr.status, { ...storeErr });
      return companyStore;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .delete(
    '/:id',
    async ({ params, error }) => {
      const [companyStore, storeErr] = await storeService.delete(params.id);
      if (storeErr) throw error(storeErr.status, { ...storeErr });
      return companyStore;
    },
    { params: t.Object({ id: t.Number() }), ...roleMiddleware(['SUPER_ADMIN']) },
  );
