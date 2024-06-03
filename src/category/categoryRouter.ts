import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { CategoryController } from './categoryController';
import categoryValidator from './categoryValidator';
import { CategoryService } from './categoryService';
import logger from '../config/logger';

const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    '/',
    categoryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.createCategory(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
