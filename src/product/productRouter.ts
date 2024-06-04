import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { ProductController } from './productController';
import createProductValidator from './createProductValidator';
import updateProductValidator from './updateProductValidator';
import { ProductService } from './productService';
import logger from '../config/logger';
import { asyncFnWrapper } from '../common/utils/asyncFnWrapper';
import isAuthenticated from '../middlewares/isAuthenticated';
import { isAuthorized } from '../middlewares/isAuthorized';
import { Roles } from '../common/constant';
import fileUpload from 'express-fileupload';
import { GCPStorage } from '../common/services/GCPStorage';
import createHttpError from 'http-errors';

const router = express.Router();

const productService = new ProductService();
const storage = new GCPStorage();
const productController = new ProductController(
    productService,
    storage,
    logger,
);

router.post(
    '/',
    isAuthenticated,
    isAuthorized([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 2 * 1024 * 1024 }, // Set the file size limit to 2 MB
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(createHttpError(400, 'File size limit exceeded'));
        },
    }),
    createProductValidator,
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            productController.createProduct(
                req,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

router.patch(
    '/:productId',
    isAuthenticated,
    isAuthorized([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 2 * 1024 * 1024 }, // Set the file size limit to 2 MB
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(createHttpError(400, 'File size limit exceeded'));
        },
    }),
    updateProductValidator,
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            productController.updateProduct(
                req,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

export default router;
