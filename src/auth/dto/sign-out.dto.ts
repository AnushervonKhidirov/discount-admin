import { t } from 'elysia';

export const signOutBody = t.Object({
  refreshToken: t.String(),
});

export type SignOutDto = typeof signOutBody.static;
