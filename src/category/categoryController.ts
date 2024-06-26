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
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { name, priceConfiguration, attributes } = req.body as Category;

        this.logger.debug('New request to create category', {
            name,
            priceConfiguration,
            attributes,
        });

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
    }

    async getAllCategory(req: Request, res: Response) {
        const category = await this.categoryService.getAll();

        this.logger.info('All categories fetched');
        res.status(200).json(category);
    }

    async getSingleCategory(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params;
        const category = await this.categoryService.getOne(categoryId);
        if (!category) {
            return next(createHttpError(404, 'Category not found'));
        }
        this.logger.info(`Getting category`, { id: category._id });
        res.json(category);
    }
}
