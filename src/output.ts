import { pino } from 'pino';

export const logger = pino({
  name: 'envienc',
  transport:
    process.env.LOG_JSON === 'true'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
          },
        },
});
