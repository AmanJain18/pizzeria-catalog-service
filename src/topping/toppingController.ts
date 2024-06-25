import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { ToppingService } from './toppingService';
import {
    CreateToppingRequest,
    UpdateToppingRequest,
    Topping,
} from './toppingTypes';
import { FileStorage, UploadFileData } from './../common/types/storage';
import { v4 as uuid } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { AuthRequest } from '../common/types';
import { Roles } from '../common/constant';
import mongoose from 'mongoose';

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
        private storage: FileStorage,
        private logger: Logger,
    ) {}

    async createTopping(
        req: CreateToppingRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const uploadedFile = req.files?.image as UploadedFile;
        if (!uploadedFile) {
            return next(createHttpError(400, 'Topping image is required'));
        }
        const imageFilename = uuid();

        await this.storage.uploadFile({
            fileName: imageFilename,
            mimeType: uploadedFile.mimetype,
            fileData: uploadedFile.data as Buffer,
        } as UploadFileData);

        const { name, price, tenantId, isPublish } = req.body;

        this.logger.debug('New request to create topping', {
            name,
            price,
            tenantId,
            isPublish,
        });

        const topping = await this.toppingService.create({
            name,
            image: imageFilename,
            price,
            tenantId,
            isPublish: isPublish ? isPublish : false,
        });

        this.logger.info('New topping created', { id: topping._id });
        res.status(201).json({
            id: topping._id,
            message: 'Topping created',
        });
    }

    async getToppings(req: Request, res: Response) {
        const toppingsResponse = await this.toppingService.getAll();

        this.logger.info('All toppings fetched');
        const toppings = toppingsResponse.map((topping: Topping) => ({
            ...topping,
            image: this.storage.getFileUrl(topping.image),
        }));
        res.json(toppings);
    }

    async getSingleTopping(req: Request, res: Response, next: NextFunction) {
        const { toppingId } = req.params;
        const topping = await this.toppingService.getById(toppingId);
        if (!topping) {
            return next(createHttpError(404, 'Topping not found'));
        }
        this.logger.info(`Getting topping`, { id: topping._id });
        res.json({
            ...topping,
            image: this.storage.getFileUrl(topping.image),
        });
    }

    async updateTopping(
        req: UpdateToppingRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { toppingId } = req.params;
        const uploadedFile = req.files?.image as UploadedFile;
        const tenant = (req as AuthRequest).auth?.tenant;

        const topping = await this.toppingService.getById(toppingId);

        if (!topping) {
            return next(createHttpError(404, 'Topping not found'));
        }

        if (
            (req as AuthRequest).auth.role !== Roles.ADMIN &&
            topping.tenantId !== tenant
        ) {
            return next(
                createHttpError(
                    403,
                    'You are not authorized to update this topping',
                ),
            );
        }
        let imageFilename: string | undefined;
        if (uploadedFile) {
            imageFilename = uuid();
            await this.storage.uploadFile({
                fileName: imageFilename,
                mimeType: uploadedFile.mimetype,
                fileData: uploadedFile.data as Buffer,
            } as UploadFileData);
            await this.storage.deleteFile(topping.image);
        }

        const { name, price, tenantId, isPublish } = req.body;

        this.logger.debug('New request to update topping', {
            toppingId,
            name,
            price,
            tenantId,
            isPublish,
        });

        const updatedTopping = await this.toppingService.update(toppingId, {
            name,
            image: uploadedFile ? imageFilename! : topping.image,
            price,
            tenantId,
            isPublish: isPublish ? isPublish : topping.isPublish,
        });

        this.logger.info('Topping updated', { toppingId: topping._id });
        res.status(200).json({
            id: topping._id,
            message: 'Topping updated',
        });
    }

    async deleteTopping(req: Request, res: Response, next: NextFunction) {
        const { toppingId } = req.params;
        const tenant = (req as AuthRequest).auth?.tenant;
        const topping = await this.toppingService.getById(toppingId);

        if (!topping) {
            return next(createHttpError(404, 'Topping not found'));
        }

        if (
            (req as AuthRequest).auth.role !== Roles.ADMIN &&
            topping.tenantId !== tenant
        ) {
            return next(
                createHttpError(
                    403,
                    'You are not authorized to delete this topping',
                ),
            );
        }

        this.logger.debug('New request to delete topping', {
            toppingId,
            tenant,
        });

        await this.toppingService.delete(toppingId);
        await this.storage.deleteFile(topping.image);

        this.logger.info('Topping deleted', {
            id: toppingId,
            tenantId: tenant,
        });

        res.status(200).json({
            id: toppingId,
            message: 'Topping deleted',
        });
    }
}
