import { t } from 'elysia';

export const updateCompanyBody = t.Object({
  name: t.Optional(t.String()),
  about: t.Optional(t.String()),
  logoUrl: t.Optional(t.String()),
});

export type UpdateCompanyDto = typeof updateCompanyBody.static;
