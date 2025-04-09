import { t } from 'elysia';

export const signInBody = t.Object({
  username: t.String(),
  password: t.String(),
});

export type SignInDto = typeof signInBody.static;
