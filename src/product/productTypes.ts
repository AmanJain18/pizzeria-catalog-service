import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import mongoose from 'mongoose';

export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        sizeOptions: {
            [key: string]: number;
        };
    };
}

export interface Attribute {
    name: string;
    value: string | boolean | number;
}

export interface BaseProduct {
    name: string;
    description: string;
    image: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
    tenantId: string;
    categoryId: string;
    isPublished: boolean;
}

export interface CreateProduct extends BaseProduct {}

export interface UpdateProduct extends BaseProduct {}

export interface QueryFilters {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}

export interface Product extends BaseProduct {
    _id?: mongoose.Types.ObjectId;
}

export interface CreateProductRequest extends Request {
    body: {
        name: string;
        description: string;
        priceConfiguration: string;
        attributes: string;
        tenantId: string;
        categoryId: string;
        isPublished?: boolean;
    };
    files: {
        image: UploadedFile;
    };
}

export interface UpdateProductRequest extends Request {
    body: {
        name: string;
        description: string;
        priceConfiguration: string;
        attributes: string;
        tenantId: string;
        categoryId: string;
        isPublished?: boolean;
    };
    files?: {
        image?: UploadedFile;
    };
}
