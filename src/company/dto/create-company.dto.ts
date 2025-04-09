import { t } from 'elysia';

export const createCompanyBody = t.Object({
  name: t.String(),
  about: t.Optional(t.String()),
});

export type CreateCompanyDto = typeof createCompanyBody.static;
