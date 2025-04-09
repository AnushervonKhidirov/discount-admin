import { t } from 'elysia';

export const createCashbackBody = t.Object({
  size: t.Number({ minimum: 0, maximum: 100 }),
  about: t.Optional(t.String()),
  startAt: t.Date(),
  endAt: t.Date(),
  bankId: t.Number(),
});

export type CreateCashbackDto = typeof createCashbackBody.static;
