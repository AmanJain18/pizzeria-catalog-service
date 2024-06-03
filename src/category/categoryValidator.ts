import { body } from 'express-validator';

export default [
    // Validate 'name'
    body('name')
        .exists()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
        .notEmpty()
        .trim(), // Trim leading/trailing whitespace

    // Validate 'priceConfiguration': object with 'priceType' and 'sizeOptions'
    body('priceConfiguration')
        .exists()
        .withMessage('Price configuration is required')
        .isObject()
        .withMessage('Price configuration must be an object')
        .custom((value: { priceType?: string; sizeOptions?: string[] }) => {
            if (!value?.priceType || !value.sizeOptions) {
                throw new Error(
                    'Missing required fields in price configuration',
                );
            }
            return true; // Custom validation passes
        }),
    body('priceConfiguration.priceType')
        .isIn(['base', 'additional'])
        .withMessage('Invalid price type. Must be "base" or "additional"'),
    body('priceConfiguration.sizeOptions')
        .isArray()
        .withMessage('Size options must be an array')
        .notEmpty()
        .customSanitizer((value: string[]) =>
            value.map((option: string) => option.trim()),
        ), // Trim whitespace from each size option

    // Validate 'attributes': array of objects with 'name', 'widgetType', 'defaultValue', and 'options'
    body('attributes')
        .exists()
        .withMessage('Attributes are required')
        .isArray()
        .withMessage('Attributes must be an array')
        .notEmpty(),
    body('attributes.*') // Validate each attribute object within the array
        .custom(
            (value: {
                name: string;
                widgetType: string;
                defaultValue: string;
                options: string[];
            }) => {
                if (
                    !value.name ||
                    !value.widgetType ||
                    !value.defaultValue ||
                    !value.options
                ) {
                    throw new Error('Missing required fields in attribute');
                }
                return true; // Custom validation passes
            },
        ),
    body('attributes.*.name')
        .exists()
        .withMessage('Attribute name is required')
        .isString()
        .withMessage('Attribute name must be a string')
        .trim(),
    body('attributes.*.widgetType')
        .isIn(['switch', 'radio'])
        .withMessage('Invalid widget type. Must be "switch" or "radio"'),
    body('attributes.*.defaultValue')
        .exists()
        .withMessage('Attribute default value is required')
        .isString()
        .withMessage('Attribute default value must be a string')
        .trim(),
    body('attributes.*.options')
        .isArray()
        .withMessage('Attribute options must be an array')
        .notEmpty()
        .customSanitizer((value: string[]) =>
            value.map((option: string) => option.trim()),
        ), // Trim whitespace from each option
];

// const { checkSchema } = require('express-validator');

// const validateCategory = checkSchema({
//     name: {
//         in: ['body'], // Specify location (body in this case)
//         exists: {
//             errorMessage: 'Category name is required',
//         },
//         isString: {
//             errorMessage: 'Category name must be a string',
//         },
//         trim: true, // Trim leading/trailing whitespace
//     },
//     priceConfiguration: {
//         in: ['body'],
//         exists: {
//             errorMessage: 'Price configuration is required',
//         },
//         isObject: {
//             errorMessage: 'Price configuration must be an object',
//         },
//         custom: {
//             options: (value) => {
//                 if (!value?.priceType || !value.sizeOptions) {
//                     throw new Error(
//                         'Missing required fields in price configuration',
//                     );
//                 }
//             },
//         },
//     },
//     'priceConfiguration.priceType': {
//         in: ['body'],
//         isIn: {
//             options: ['base', 'additional'],
//             errorMessage: 'Invalid price type. Must be "base" or "additional"',
//         },
//     },
//     'priceConfiguration.sizeOptions': {
//         in: ['body'],
//         isArray: {
//             errorMessage: 'Size options must be an array',
//         },
//         notEmpty: {
//             errorMessage: 'Size options cannot be empty',
//         },
//         customSanitizer: (value) => value.map((option) => option.trim()), // Trim whitespace from each size option
//     },
//     attributes: {
//         in: ['body'],
//         exists: {
//             errorMessage: 'Attributes are required',
//         },
//         isArray: {
//             errorMessage: 'Attributes must be an array',
//         },
//         notEmpty: {
//             errorMessage: 'Attributes cannot be empty',
//         },
//     },
//     'attributes.*': {
//          Validate each attribute object within the array
//         custom: {
//             options: (value) => {
//                 if (
//                     !value.name ||
//                     !value.widgetType ||
//                     !value.defaultValue ||
//                     !value.options
//                 ) {
//                     throw new Error('Missing required fields in attribute');
//                 }
//             },
//         },
//     },
//     'attributes.*.name': {
//         in: ['body'],
//         exists: {
//             errorMessage: 'Attribute name is required',
//         },
//         isString: {
//             errorMessage: 'Attribute name must be a string',
//         },
//         trim: true, // Trim leading/trailing whitespace
//     },
//     'attributes.*.widgetType': {
//         in: ['body'],
//         isIn: {
//             options: ['switch', 'radio'],
//             errorMessage: 'Invalid widget type. Must be "switch" or "radio"',
//         },
//     },
//     'attributes.*.defaultValue': {
//         in: ['body'],
//         exists: {
//             errorMessage: 'Attribute default value is required',
//         },
//         isString: {
//             errorMessage: 'Attribute default value must be a string',
//         },
//         trim: true, // Trim leading/trailing whitespace
//     },
//     'attributes.*.options': {
//         in: ['body'],
//         isArray: {
//             errorMessage: 'Attribute options must be an array',
//         },
//         notEmpty: {
//             errorMessage: 'Attribute options cannot be empty',
//         },
//         customSanitizer: (value) => value.map((option) => option.trim()), // Trim whitespace from each option
//     },
// });

// export default validateCategory;
