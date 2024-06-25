import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { ToppingController } from './toppingController';
import toppingValidator from './toppingValidator';
import { ToppingService } from './toppingService';
import logger from '../config/logger';
import { asyncFnWrapper } from '../common/utils/asyncFnWrapper';
import isAuthenticated from '../middlewares/isAuthenticated';
import { isAuthorized } from '../middlewares/isAuthorized';
import { Roles } from '../common/constant';
import fileUpload from 'express-fileupload';
import { GCPStorage } from '../common/services/GCPStorage';
import createHttpError from 'http-errors';
import { CreateToppingRequest, UpdateToppingRequest } from './toppingTypes';

const router = express.Router();

const toppingService = new ToppingService();
const storage = new GCPStorage();
const toppingController = new ToppingController(
    toppingService,
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
            next(createHttpError(400, 'File size limit exceeded, max 2MB'));
        },
    }),
    toppingValidator,
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            toppingController.createTopping(
                req as CreateToppingRequest,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

router.get(
    '/',
    asyncFnWrapper(
        (req: Request, res: Response) =>
            toppingController.getToppings(
                req,
                res,
            ) as unknown as RequestHandler,
    ),
);

router.get(
    '/:toppingId',
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            toppingController.getSingleTopping(
                req,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

router.put(
    '/:toppingId',
    isAuthenticated,
    isAuthorized([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 2 * 1024 * 1024 }, // Set the file size limit to 2 MB
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(createHttpError(400, 'File size limit exceeded, max 2MB'));
        },
    }),
    toppingValidator,
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            toppingController.updateTopping(
                req as UpdateToppingRequest,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

router.delete(
    '/:toppingId',
    isAuthenticated,
    isAuthorized([Roles.ADMIN, Roles.MANAGER]),
    asyncFnWrapper(
        (req: Request, res: Response, next: NextFunction) =>
            toppingController.deleteTopping(
                req,
                res,
                next,
            ) as unknown as RequestHandler,
    ),
);

export default router;
