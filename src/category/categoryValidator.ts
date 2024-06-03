import { body } from 'express-validator';
import { Attribute } from './categoryTypes';

export default [
    // Validate 'name'
    body('name')
        .exists()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
        .notEmpty()
        .withMessage('Category name cannot be empty')
        .trim(),

    // Validate 'priceConfiguration' as an object with dynamic keys
    body('priceConfiguration')
        .exists()
        .withMessage('Price configuration is required')
        .isObject()
        .withMessage('Price configuration must be an object')
        .custom((priceConfiguration: string) => {
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
        .custom((sizeOptions: string[]) => {
            if (!sizeOptions.length) {
                throw new Error(
                    'Size options array must have at least one element',
                );
            }
            return true;
        })
        .isString()
        .withMessage('Size options must be strings')
        .trim(),

    // Validate 'attributes': array of objects with 'name', 'widgetType', 'defaultValue', and 'options'
    body('attributes')
        .exists()
        .withMessage('Attributes are required')
        .isArray()
        .withMessage('Attributes must be an array')
        .custom((attributes: Attribute[]) => {
            if (!Array.isArray(attributes) || attributes.length === 0) {
                throw new Error(
                    'Attributes array cannot be empty and must have at least one element',
                );
            }
            return true;
        }),

    body('attributes.*.name')
        .exists()
        .withMessage('Attribute name is required')
        .isString()
        .withMessage('Attribute name must be a string')
        .notEmpty()
        .withMessage('Attribute name cannot be empty')
        .trim(),

    body('attributes.*.widgetType')
        .exists()
        .withMessage('Widget type is required')
        .isIn(['switch', 'radio'])
        .withMessage(`Widget type must be either ${"'switch'"} or ${"'radio'"}`)
        .isString()
        .withMessage('Widget type must be a string')
        .trim(),

    body('attributes.*.defaultValue')
        .exists()
        .withMessage('Default value is required')
        .notEmpty()
        .withMessage('Default value cannot be empty')
        .trim(),

    body('attributes.*.options')
        .exists()
        .withMessage('Options are required')
        .isArray()
        .withMessage('Options must be an array')
        .custom((options: string[]) => {
            if (!Array.isArray(options) || options.length === 0) {
                throw new Error('Options array must have at least one element');
            }
            return true;
        })
        .isString()
        .withMessage('Options must be strings')
        .trim(),
];

/*
import { body, checkSchema } from 'express-validator';

const attributeSchema = {
    name: {
        in: ['body'],
        isString: true,
        errorMessage: 'Attribute name must be a string',
        notEmpty: true,
        errorMessage: 'Attribute name is required',
    },
    widgetType: {
        in: ['body'],
        isIn: {
            options: [['switch', 'radio']],
            errorMessage: 'Widget type must be either "switch" or "radio"',
        },
        errorMessage: 'Widget type is required',
    },
    defaultValue: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'Default value is required',
    },
    options: {
        in: ['body'],
        isArray: true,
        errorMessage: 'Options must be an array',
        custom: {
            options: (options: string[]) => {
                if (!options.length) {
                    throw new Error('Options array must have at least one element');
                }
                return true;
            }
        },
    },
};

const priceConfigurationSchema = {
    'priceConfiguration.*.priceType': {
        in: ['body'],
        isIn: {
            options: [['base', 'additional']],
            errorMessage: 'Price type must be either "base" or "additional"',
        },
        errorMessage: 'Price type is required',
    },
    'priceConfiguration.*.sizeOptions': {
        in: ['body'],
        isArray: true,
        errorMessage: 'Size options must be an array',
        custom: {
            options: (sizeOptions: string[]) => {
                if (!sizeOptions.length) {
                    throw new Error('Size options array must have at least one element');
                }
                return true;
            }
        },
    },
};

const categoryValidators = [
    body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    body('attributes').isArray().withMessage('Attributes must be an array'),
    checkSchema(attributeSchema, ['attributes.*']),
    checkSchema(priceConfigurationSchema),
];

export default categoryValidators;

*/
