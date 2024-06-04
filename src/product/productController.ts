import { Request } from 'express-jwt';
import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { ProductService } from './productService';
import { Product } from './productTypes';
import { FileStorage, UploadFileData } from '../common/types/storage';
import { v4 as uuid } from 'uuid';
import { UploadedFile } from 'express-fileupload';

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private logger: Logger,
    ) {}
    async createProduct(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const uploadedFile = req.files?.image as UploadedFile;
        if (!uploadedFile) {
            return next(createHttpError(400, 'Product image is required'));
        }
        const imageFilename = uuid();

        await this.storage.uploadFile({
            fileName: imageFilename,
            mimeType: uploadedFile.mimetype,
            fileData: uploadedFile.data as Buffer,
        } as UploadFileData);

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            categoryId,
            tenantId,
            isPublished,
        } = req.body as Product;

        const product = await this.productService.create({
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublished,
            image: imageFilename,
        } as Product);

        this.logger.info('New product created', { id: product._id });
        res.status(201).json({
            id: product._id,
            message: 'Product created',
        });
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { productId } = req.params;
        const uploadedFile = req.files?.image as UploadedFile;

        const product = await this.productService.getById(productId);

        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }

        let imageFilename: string | undefined;
        if (uploadedFile) {
            imageFilename = uuid();
            await this.storage.uploadFile({
                fileName: imageFilename,
                mimeType: uploadedFile.mimetype,
                fileData: uploadedFile.data as Buffer,
            } as UploadFileData);

            await this.storage.deleteFile(product.image);
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            categoryId,
            tenantId,
            isPublished,
        } = req.body as Product;

        await this.productService.update(productId, {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublished,
            image: uploadedFile ? imageFilename : product.image,
        } as Product);

        this.logger.info('Product updated', { productId: productId });
        res.json({
            id: productId,
            message: 'Product updated',
        });
    }
}
