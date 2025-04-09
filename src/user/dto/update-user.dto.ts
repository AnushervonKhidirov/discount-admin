import { t } from 'elysia';

export const updateUserBody = t.Object({
  username: t.Optional(t.String()),
  password: t.Optional(t.String({ minLength: 5 })),
});

export type UpdateUserDto = typeof updateUserBody.static;
