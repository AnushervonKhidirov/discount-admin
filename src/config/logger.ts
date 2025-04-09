import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  format: format.json(),
  transports: [new transports.File({ filename: 'error.log', level: 'error' })],
});
