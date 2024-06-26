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
import { GCPStorage } from '../common/services/GCPStorage';
import createHttpError from 'http-errors';
import { CreateProductRequest, UpdateProductRequest } from './productTypes';

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
    productValidator,
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            productController.createProduct(
                req as CreateProductRequest,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

router.put(
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
    productValidator,
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            productController.updateProduct(
                req as UpdateProductRequest,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

router.get(
    '/',
    asyncFnWrapper(
        (req: Request, res: Response) =>
            productController.getProducts(
                req,
                res,
            ) as unknown as RequestHandler,
    ),
);

router.get(
    '/:productId',
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            productController.getProductById(
                req,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

router.delete(
    '/:productId',
    isAuthenticated,
    isAuthorized([Roles.ADMIN, Roles.MANAGER]),
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            productController.deleteProduct(
                req,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

export default router;
