import { t } from 'elysia';

export const createDiscountBody = t.Object({
  size: t.Number({ minimum: 0, maximum: 100 }),
  about: t.Optional(t.String()),
  startAt: t.Date(),
  endAt: t.Date(),
});

export type CreateDiscountDto = typeof createDiscountBody.static;
