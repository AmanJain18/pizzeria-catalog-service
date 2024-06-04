import ProductModel from './productModel';
import { Product, QueryFilters } from './productTypes';

export class ProductService {
    async create(product: Product) {
        const newProduct = new ProductModel(product);
        return await newProduct.save();
    }

    async update(id: string, product: Product) {
        return await ProductModel.findOneAndUpdate(
            { _id: id },
            {
                $set: product,
            },
            {
                new: true,
            },
        );
    }

    async getById(id: string) {
        return await ProductModel.findById(id);
    }

    async getAll(searchQuery: string, filters: QueryFilters) {
        const searchQueryRegex = new RegExp(searchQuery, 'i');
        return (await ProductModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [{ name: searchQueryRegex }],
                        },
                        { ...filters },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                priceConfiguration: 1,
                                attributes: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$category',
            },
        ]).exec()) as Product[];
    }
}
