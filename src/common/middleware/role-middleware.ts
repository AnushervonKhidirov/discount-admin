import type { $Enums } from '@prisma/client';
import { error } from 'elysia';
import { ForbiddenException, UnauthorizedException } from '@exception';

export const roleMiddleware = (roles: $Enums.Role[]) => {
  return {
    beforeHandle: ({
      store,
    }: {
      store?: {
        userId: number;
        role: $Enums.Role;
      };
    }) => {
      if (!store?.role) {
        const err = new UnauthorizedException();
        throw error(err.status, { ...err });
      }

      if (!roles.includes(store.role)) {
        const err = new ForbiddenException();
        throw error(err.status, { ...err });
      }
    },
  };
};
