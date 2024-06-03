import { Request } from 'express-jwt';
import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { Logger } from 'winston';
import createHttpError from 'http-errors';

export class ProductController {
    constructor(private logger: Logger) {}
    async createProduct(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
    }
}
