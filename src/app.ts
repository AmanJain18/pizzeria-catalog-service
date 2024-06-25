import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { configSetup } from './config/configSetup';
import categoryRouter from './category/categoryRouter';
import productRouter from './product/productRouter';
import toppingRouter from './topping/toppingRouter';

const app = express();

configSetup(app);

app.get('/', (req, res) => {
    res.send('Welcome to catalog service');
});

app.use('/api/v1/categories', categoryRouter);

app.use('/api/v1/products', productRouter);

app.use('/api/v1/toppings', toppingRouter);

app.use(globalErrorHandler);
export default app;
