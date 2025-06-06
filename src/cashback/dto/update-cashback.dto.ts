import { t } from 'elysia';

export const updateCashbackBody = t.Object({
  size: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
  about: t.Optional(t.String()),
  startAt: t.Optional(t.Date()),
  endAt: t.Optional(t.Date()),
  bankId: t.Number(),
});
