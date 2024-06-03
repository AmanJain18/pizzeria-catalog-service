import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { ProductController } from './productController';
import productValidator from './productValidator';
import logger from '../config/logger';
import { asyncFnWrapper } from '../common/utils/asyncFnWrapper';
import isAuthenticated from '../middlewares/isAuthenticated';
import { isAuthorized } from '../middlewares/isAuthorized';
import { Roles } from '../common/constant';

const router = express.Router();

const productController = new ProductController(logger);

router.post(
    '/',
    isAuthenticated,
    isAuthorized([Roles.ADMIN, Roles.MANAGER]),
    productValidator,
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            productController.createProduct(
                req,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

export default router;
