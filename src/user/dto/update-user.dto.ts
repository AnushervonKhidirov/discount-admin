import { $Enums } from '@prisma/client';
import { t } from 'elysia';

export const updateUserBody = t.Object({
  username: t.Optional(t.String()),
  password: t.Optional(t.String({ minLength: 5 })),
  role: t.Optional(t.Enum($Enums.Role)),
  archived: t.Optional(t.Boolean()),
});

export type UpdateUserDto = typeof updateUserBody.static;
