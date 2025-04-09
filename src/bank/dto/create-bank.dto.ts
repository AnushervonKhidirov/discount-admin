import { t } from 'elysia';

export const createBankBody = t.Object({
  name: t.String(),
});

export type CreateBankDto = typeof createBankBody.static;
