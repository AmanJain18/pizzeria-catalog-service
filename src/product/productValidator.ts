import { body } from 'express-validator';
// import { Attribute } from './productTypes';

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

    body('description')
        .exists()
        .withMessage('Product description is required')
        .isString()
        .withMessage('Product description must be a string')
        .notEmpty()
        .withMessage('Product description cannot be empty')
        .trim(),

    // body('image').custom((value, { req }) => {
    //     if (!req.files) throw new Error('Product image is required');
    //     return true;
    // }),

    body('tenantId')
        .exists()
        .withMessage('Tenant id is required')
        .isString()
        .withMessage('Tenant id must be a string')
        .notEmpty()
        .withMessage('Tenant id cannot be empty')
        .trim(),

    body('categoryId')
        .exists()
        .withMessage('Category id is required')
        .isString()
        .withMessage('Category id must be a string')
        .notEmpty()
        .withMessage('Category id cannot be empty')
        .trim(),

    // Validate 'priceConfiguration' as an object with dynamic keys
    body('priceConfiguration')
        .exists()
        .withMessage('Price configuration is required')
        // .isObject()
        // .withMessage('Price configuration must be an object')
        .custom((priceConfiguration: string | number) => {
            if (Object.keys(priceConfiguration).length === 0) {
                throw new Error('Price configuration cannot be empty');
            }
            return true;
        }),

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

    // Validate 'attributes': array of objects with 'name', 'widgetType', 'defaultValue', and 'options'
    body('attributes').exists().withMessage('Attributes are required'),
    // .isArray()
    // .withMessage('Attributes must be an array')
    // .custom((attributes: Attribute[]) => {
    //     if (!Array.isArray(attributes) || attributes.length === 0) {
    //         throw new Error(
    //             'Attributes array cannot be empty and must have at least one element',
    //         );
    //     }
    //     return true;
    // }),

    body('attributes.*.name')
        .exists()
        .withMessage('Attribute name is required')
        .isString()
        .withMessage('Attribute name must be a string')
        .notEmpty()
        .withMessage('Attribute name cannot be empty')
        .trim(),

    body('attributes.*.value')
        .exists()
        .withMessage('Default value is required')
        .notEmpty()
        .withMessage('Default value cannot be empty')
        .trim(),
];
