import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
import { DiscountService } from './discount.service';
import { createDiscountBody } from './dto/create-discount.dto';
import { updateDiscountBody } from './dto/update-discount.dto';

export const discountRouter = new Elysia({ prefix: 'discounts' });
const discountService = new DiscountService();

discountRouter
  .use(authMiddleware)
  .get('/', async ({ error }) => {
    const [discounts, err] = await discountService.findMany();
    if (err) throw error(err.status, { ...err });
    return discounts;
  })
  .get(
    '/:id',
    async ({ params, error }) => {
      const [discount, err] = await discountService.findOne({ id: params.id });
      if (err) throw error(err.status, { ...err });
      return discount;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .post(
    '/',
    async ({ body, query, error }) => {
      const [discount, discountErr] = await discountService.create(body, query.companyId);
      if (discountErr) throw error(discountErr.status, { ...discountErr });
      return discount;
    },
    { body: createDiscountBody, query: t.Object({ companyId: t.Number() }) },
  )
  .put(
    '/:id',
    async ({ params, body, query, error }) => {
      const [discount, discountErr] = await discountService.update(
        params.id,
        body,
        query.companyId,
      );

      if (discountErr) throw error(discountErr.status, { ...discountErr });

      return discount;
    },
    {
      body: updateDiscountBody,
      params: t.Object({ id: t.Number() }),
      query: t.Object({ companyId: t.Number() }),
    },
  )
  .patch(
    '/archive/:id',
    async ({ params, error }) => {
      const [discount, err] = await discountService.archive(params.id);
      if (err) throw error(err.status, { ...err });
      return discount;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .patch(
    '/unarchive/:id',
    async ({ params, error }) => {
      const [discount, err] = await discountService.unarchive(params.id);
      if (err) throw error(err.status, { ...err });
      return discount;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .delete(
    '/delete/:id',
    async ({ params, error }) => {
      const [discount, err] = await discountService.delete(params.id);
      if (err) throw error(err.status, { ...err });
      return discount;
    },
    { params: t.Object({ id: t.Number() }), ...roleMiddleware(['SUPER_ADMIN']) },
  );
