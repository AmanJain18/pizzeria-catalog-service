import config from 'config';
import mongoose from 'mongoose';

export const db = mongoose;

const { host, port, user, password, database } = config.get<{
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}>('catalogService.dbConfig');

export const dbConfig = {
    url: `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin&w=1`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};

export const connectDb = async () => {
    await db.connect(dbConfig.url);
};
