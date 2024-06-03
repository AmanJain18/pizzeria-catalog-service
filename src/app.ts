import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { configSetup } from './config/configSetup';
import categoryRouter from './category/categoryRouter';
import productRouter from './product/productRouter';

const app = express();

configSetup(app);

app.get('/', (req, res) => {
    res.send('Welcome to catalog service');
});

app.use('/categories', categoryRouter);

app.use('/products', productRouter);

app.use(globalErrorHandler);
export default app;
