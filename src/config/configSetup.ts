import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';

export const configSetup = (app: express.Application) => {
    app.use(
        cors({
            origin: config.get('cors.corsOrigin') || 'http://localhost:3000',
            credentials: true,
        }),
    );

    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
};
