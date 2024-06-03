import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { ProductController } from './productController';
import productValidator from './productValidator';
import { ProductService } from './productService';
import logger from '../config/logger';
import { asyncFnWrapper } from '../common/utils/asyncFnWrapper';
import isAuthenticated from '../middlewares/isAuthenticated';
import { isAuthorized } from '../middlewares/isAuthorized';
import { Roles } from '../common/constant';
import fileUpload from 'express-fileupload';

const router = express.Router();

const productService = new ProductService();
const productController = new ProductController(productService, logger);

router.post(
    '/',
    isAuthenticated,
    isAuthorized([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
    }),
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
