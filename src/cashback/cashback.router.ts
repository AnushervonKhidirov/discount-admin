import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
import { CashbackService } from './cashback.service';
import { CompanyService } from '../company/company.service';
import { createCashbackBody } from './dto/create-cashback.dto';
import { updateCashbackBody } from './dto/update-cashback.dto';

export const cashbackRouter = new Elysia({ prefix: 'cashbacks' });
const companyService = new CompanyService();
const cashbackService = new CashbackService();

cashbackRouter
  .use(authMiddleware)
  .get('/', async ({ error }) => {
    const [allCashback, err] = await cashbackService.findMany();
    if (err) throw error(err.status, { ...err });
    return allCashback;
  })
  .get(
    '/:id',
    async ({ params, error }) => {
      const [cashback, err] = await cashbackService.findOne({ id: params.id });
      if (err) throw error(err.status, { ...err });
      return cashback;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .post(
    '/',
    async ({ body, query, error }) => {
      const [company, companyErr] = await companyService.findOne({ id: query.companyId });
      if (companyErr) throw error(companyErr.status, { ...companyErr });

      const [cashback, cashbackErr] = await cashbackService.create(body, company.id);
      if (cashbackErr) throw error(cashbackErr.status, { ...cashbackErr });

      return cashback;
    },
    { body: createCashbackBody, query: t.Object({ companyId: t.Number() }) },
  )
  .put(
    '/:id',
    async ({ params, body, query, error }) => {
      const [cashback, cashbackErr] = await cashbackService.update(
        params.id,
        body,
        query.companyId,
      );

      if (cashbackErr) throw error(cashbackErr.status, { ...cashbackErr });

      return cashback;
    },
    {
      body: updateCashbackBody,
      params: t.Object({ id: t.Number() }),
      query: t.Object({ companyId: t.Number() }),
    },
  )
  .patch(
    '/archive/:id',
    async ({ params, error }) => {
      const [cashback, err] = await cashbackService.archive(params.id);
      if (err) throw error(err.status, { ...err });
      return cashback;
    },
    {
      params: t.Object({ id: t.Number() }),
    },
  )
  .patch(
    '/unarchive/:id',
    async ({ params, error }) => {
      const [cashback, err] = await cashbackService.unarchive(params.id);
      if (err) throw error(err.status, { ...err });
      return cashback;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .delete(
    '/delete/:id',
    async ({ params, error }) => {
      const [cashback, err] = await cashbackService.delete(params.id);
      if (err) throw error(err.status, { ...err });
      return cashback;
    },
    { params: t.Object({ id: t.Number() }), ...roleMiddleware(['SUPER_ADMIN']) },
  );
