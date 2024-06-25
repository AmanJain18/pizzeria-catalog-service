import { body } from 'express-validator';
import { PriceConfiguration, Attribute } from './productTypes';

export default [
    // Validate 'name'
    body('name')
        .exists()
        .withMessage('Product name is required')
        .isString()
        .withMessage('Product name must be a string')
        .notEmpty()
        .withMessage('Product name cannot be empty')
        .trim(),

    // Validate 'description'
    body('description')
        .exists()
        .withMessage('Product description is required')
        .isString()
        .withMessage('Product description must be a string')
        .notEmpty()
        .withMessage('Product description cannot be empty')
        .trim(),

    // Validate 'image'
    body('image').custom((value, { req }) => {
        if (req.method === 'POST' && (!req.files || !req.files.image)) {
            throw new Error('Product image is required');
        }
        return true;
    }),

    // Validate 'tenantId'
    body('tenantId')
        .exists()
        .withMessage('Tenant ID is required')
        .isString()
        .withMessage('Tenant ID must be a string')
        .notEmpty()
        .withMessage('Tenant ID cannot be empty')
        .trim(),

    // Validate 'categoryId'
    body('categoryId')
        .exists()
        .withMessage('Category ID is required')
        .isString()
        .withMessage('Category ID must be a string')
        .notEmpty()
        .withMessage('Category ID cannot be empty')
        .trim(),

    // Validate 'priceConfiguration'
    body('priceConfiguration')
        .exists()
        .withMessage('Price configuration is required')
        .custom((value: PriceConfiguration) => {
            if (Object.keys(value).length === 0) {
                throw new Error('Price configuration cannot be empty');
            }
            return true;
        }),

    // Validate 'priceType'
    body('priceConfiguration.*.priceType')
        .exists()
        .withMessage('Price type is required')
        .isIn(['base', 'additional'])
        .withMessage(
            `Price type must be either ${"'base'"} or ${"'additional'"}`,
        )
        .isString()
        .withMessage('Price type must be a string')
        .trim(),

    // Validate 'sizeOptions'
    body('priceConfiguration.*.sizeOptions')
        .exists()
        .withMessage('Size options are required')
        .isArray()
        .withMessage('Size options must be an array')
        .notEmpty()
        .withMessage('Size options array cannot be empty')
        .custom((sizeOptions: number[]) => {
            if (!sizeOptions.length) {
                throw new Error(
                    'Size options array must have at least one element',
                );
            }
            return true;
        }),

    // Validate 'attributes'
    body('attributes')
        .exists()
        .withMessage('Attributes are required')
        .notEmpty()
        .withMessage('Attributes array cannot be empty')
        .custom((attributes: Attribute[]) => {
            if (attributes.length === 0) {
                throw new Error('Attributes must have at least one element');
            }
            return true;
        }),

    // Validate 'attributes.name'
    body('attributes.*.name')
        .exists()
        .withMessage('Attribute name is required')
        .isString()
        .withMessage('Attribute name must be a string')
        .notEmpty()
        .withMessage('Attribute name cannot be empty')
        .trim(),

    // Validate 'attributes.value'
    body('attributes.*.value')
        .exists()
        .withMessage('Default value is required')
        .notEmpty()
        .withMessage('Default value cannot be empty')
        .trim(),
];
