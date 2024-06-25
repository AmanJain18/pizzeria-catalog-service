import { body } from 'express-validator';

export default [
    // Validate 'name'
    body('name')
        .exists()
        .withMessage('Topping name is required')
        .isString()
        .withMessage('Topping name must be a string')
        .notEmpty()
        .withMessage('Topping name cannot be empty')
        .trim(),

    // Validate 'image' if method is POST and no image is uploaded in the request
    body('image').custom((value, { req }) => {
        if (req.method === 'POST' && (!req.files || !req.files.image)) {
            throw new Error('topping image is required');
        }
        return true;
    }),

    // Validate 'price'
    body('price')
        .exists()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number')
        .notEmpty()
        .withMessage('Price cannot be empty'),

    // Validate 'tenantId'
    body('tenantId')
        .exists()
        .withMessage('Tenant ID is required')
        .isString()
        .withMessage('Tenant ID must be a string')
        .notEmpty()
        .withMessage('Tenant ID cannot be empty')
        .trim(),

    // Validate 'isPublish'
    body('isPublish')
        .exists()
        .withMessage('Publish status is required')
        .isBoolean()
        .withMessage('Publish status must be a boolean')
        .optional(),

    body('isAvailable')
        .isBoolean()
        .withMessage('Availability must be a boolean')
        .optional(),
];
