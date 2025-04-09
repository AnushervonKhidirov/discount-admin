import { t } from 'elysia';

export const timeValidation = t.String({
  pattern: '^(?:[01]\\d|2[03]):[0-5]\\d$',
  description: 'Time in HH:MM format',
  examples: '09:00',
});

export const createStoreBody = t.Object({
  latitude: t.Number(),
  longitude: t.Number(),
  openAt: timeValidation,
  closeAt: timeValidation,
});

export type createStoreDto = typeof createStoreBody.static;
