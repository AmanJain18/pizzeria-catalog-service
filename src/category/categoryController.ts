import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CategoryService } from './categoryService';
import { Logger } from 'winston';
import { Category } from './categoryTypes';
import createHttpError from 'http-errors';

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {}
    async createCategory(req: Request, res: Response, next: NextFunction) {
        // Validate the request
        const result = validationResult(req);
        // If there are errors, return them
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { name, priceConfiguration, attributes } = req.body as Category;
        // Log the request
        this.logger.debug('New request to create category', {
            name,
            priceConfiguration,
            attributes,
        });
        try {
            // Create the category
            const category = await this.categoryService.create({
                name,
                priceConfiguration,
                attributes,
            });

            this.logger.info('New category created', { id: category._id });
            res.status(201).json({
                id: category._id,
                message: 'Category created',
            });
        } catch (err) {
            next(err);
            return;
        }
    }
}
