// Purpose: Model for categories.

import mongoose, { AggregatePaginateModel } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Attribute, PriceConfiguration, Product } from './productTypes';

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        enum: ['base', 'additional'],
        required: true,
    },
    sizeOptions: {
        type: Map,
        of: Number,
        required: true,
    },
});

const attributeSchema = new mongoose.Schema<Attribute>({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
            required: true,
        },
        attributes: {
            type: [attributeSchema],
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        isPublished: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true },
);
productSchema.plugin(aggregatePaginate);
export default mongoose.model<Product, AggregatePaginateModel<Product>>(
    'Product',
    productSchema,
);
