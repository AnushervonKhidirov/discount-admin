import { t } from 'elysia';

export const createUserBody = t.Object({
  username: t.String(),
  password: t.String({ minLength: 5 }),
});

export type CreateUserDto = typeof createUserBody.static;
