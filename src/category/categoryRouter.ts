import express, { Request, RequestHandler, Response } from 'express';
import { CategoryController } from './categoryController';

const router = express.Router();

const categoryController = new CategoryController();

router.post(
    '/',
    (req: Request, res: Response) =>
        categoryController.createCategory(
            req,
            res,
        ) as unknown as RequestHandler,
);

export default router;
