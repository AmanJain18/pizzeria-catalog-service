import config from 'config';
import app from './app';
import logger from './config/logger';
import { connectDb } from './config/dbConfig';

const startServer = async () => {
    const PORT: number = config.get('serverConfig.port') || 5502;

    try {
        await connectDb();
        logger.info('Connected to the database');
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message);
            setTimeout(() => process.exit(1), 1000);
        }
    }
};

void startServer();
