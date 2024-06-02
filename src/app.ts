import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { configSetup } from './config/configSetup';

const app = express();

configSetup(app);

app.get('/', (req, res) => {
    res.send('Welcome to catalog service');
});

app.use(globalErrorHandler);
export default app;
