import express, { Request, RequestHandler, Response } from 'express';
import { CategoryController } from './categoryController';
import categoryValidator from './categoryValidator';

const router = express.Router();

const categoryController = new CategoryController();

router.post(
    '/',
    categoryValidator,
    (req: Request, res: Response) =>
        categoryController.createCategory(
            req,
            res,
        ) as unknown as RequestHandler,
);

export default router;
