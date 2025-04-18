import { t } from 'elysia';

export const updateBankBody = t.Object({
  name: t.Optional(t.String()),
  archived: t.Optional(t.Boolean()),
});

export type UpdateBankDto = typeof updateBankBody.static;
