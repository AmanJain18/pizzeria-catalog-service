import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { configSetup } from './config/configSetup';
import categoryRouter from './category/categoryRouter';

const app = express();

configSetup(app);

app.get('/', (req, res) => {
    res.send('Welcome to catalog service');
});

app.use('/categories', categoryRouter);

app.use(globalErrorHandler);
export default app;
