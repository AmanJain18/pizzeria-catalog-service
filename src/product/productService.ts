import ProductModel from './productModel';
import { Product, QueryFilters } from './productTypes';

export class ProductService {
    async create(product: Product) {
        return (await ProductModel.create(product)) as Product;
    }

    async update(id: string, product: Product) {
        return (await ProductModel.findOneAndUpdate(
            { _id: id },
            {
                $set: product,
            },
            {
                new: true,
            },
        )) as Product;
    }

    async getById(id: string) {
        return (await ProductModel.findById(id)) as Product;
    }

    async getAll(
        searchQuery: string,
        filters: QueryFilters,
        pagination: { page: number; limit: number },
    ) {
        const searchQueryRegex = new RegExp(searchQuery, 'i');
        const aggregate = ProductModel.aggregate([
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
        ]);

        return ProductModel.aggregatePaginate(aggregate, {
            page: pagination.page,
            limit: pagination.limit,
            customLabels: {
                docs: 'data',
                totalDocs: 'total',
                limit: 'pageSize',
                page: 'currentPage',
            },
        });
    }
}
