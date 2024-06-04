import mongoose from 'mongoose';

export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        sizeOptions: number[];
    };
}

export interface Attribute {
    name: string;
    value: string;
}

export interface Product {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    isPublished: boolean;
}

export interface QueryFilters {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}
