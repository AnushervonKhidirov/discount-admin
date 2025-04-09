import { t } from 'elysia';
import { timeValidation } from './cerate-store.dto';

export const updateStoreBody = t.Object({
  latitude: t.Optional(t.Number()),
  longitude: t.Optional(t.Number()),
  openAt: t.Optional(timeValidation),
  closeAt: t.Optional(timeValidation),
});
