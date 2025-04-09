import { t } from 'elysia';

export const updateBankBody = t.Object({
  name: t.Optional(t.String()),
  logoUrl: t.Optional(t.String()),
});

export type UpdateBankDto = typeof updateBankBody.static;
