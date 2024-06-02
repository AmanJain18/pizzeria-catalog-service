import winston from 'winston';
import { Config } from '.';

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'auth-service' },
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            level: 'error',
            dirname: 'logs',
            filename: 'error.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'info.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test',
        }),
        // new winston.transports.File({
        //     level: 'debug',
        //     dirname: 'logs',
        //     filename: 'debug.log',
        //     format: winston.format.combine(
        //         winston.format.timestamp(),
        //         winston.format.json(),
        //     ),
        //     silent: Config.NODE_ENV === 'test',
        // }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test',
        }),
    ],
});

export default logger;
