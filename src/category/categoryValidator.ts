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
