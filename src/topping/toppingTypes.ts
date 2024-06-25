import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import mongoose from 'mongoose';

// Base interface with common fields
interface BaseTopping {
    name: string;
    image: string;
    price: number;
    tenantId: string;
    isPublish: boolean;
}

export interface CreateTopping extends BaseTopping {}

export interface UpdateTopping extends BaseTopping {}

export interface Topping extends BaseTopping {
    _id: mongoose.Types.ObjectId;
}

export interface CreateToppingRequest extends Request {
    body: {
        name: string;
        price: number;
        tenantId: string;
        isPublish: boolean;
    };
    files: {
        image: UploadedFile;
    };
}

export interface UpdateToppingRequest extends Request {
    body: {
        name: string;
        price: number;
        tenantId: string;
        isPublish: boolean;
    };
    files?: {
        image?: UploadedFile;
    };
}
