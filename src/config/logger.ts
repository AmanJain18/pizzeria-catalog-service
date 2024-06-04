import winston from 'winston';
import config from 'config';

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'catalog-service' },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            level: 'error',
            dirname: 'logs',
            filename: 'error.log',
            silent: config.get('serverConfig.NODE_ENV') === 'test',
        }),
        new winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'info.log',
            silent: config.get('serverConfig.NODE_ENV') === 'test',
        }),
        new winston.transports.File({
            level: 'debug',
            dirname: 'logs',
            filename: 'debug.log',
            silent: config.get('serverConfig.NODE_ENV') === 'test',
        }),
        new winston.transports.Console({
            level: 'info',
            silent: config.get('serverConfig.NODE_ENV') === 'test',
        }),
    ],
});

export default logger;
