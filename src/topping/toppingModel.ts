// Purpose: Model for toppings.

import mongoose from 'mongoose';
import { Topping } from './toppingTypes';

const toppingSchema = new mongoose.Schema<Topping>(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        isPublish: {
            type: Boolean,
            required: true,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model('Topping', toppingSchema);
