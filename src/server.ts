import config from 'config';
import app from './app';
import logger from './config/logger';

const startServer = () => {
    const PORT: number = config.get('catalogService.serverConfig.port') || 5502;

    try {
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

startServer();
