import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';

const allowedOrigins: string[] = config.get('cors.corsOrigin');

export const configSetup = (app: express.Application) => {
    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg =
                        'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            credentials: true,
        }),
    );

    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
};
