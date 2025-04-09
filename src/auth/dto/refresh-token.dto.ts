import { t } from 'elysia';

export const refreshTokenBody = t.Object({
  refreshToken: t.String(),
});

export type RefreshTokenDto = typeof refreshTokenBody.static;
