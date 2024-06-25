import ProductModel from './productModel';
import { QueryFilters, CreateProduct, UpdateProduct } from './productTypes';

export class ProductService {
    async create(product: CreateProduct) {
        const newProduct = new ProductModel(product);
        return await newProduct.save();
    }

    async getById(productId: string) {
        return await ProductModel.findOne({ _id: productId });
    }

    async update(productId: string, product: UpdateProduct) {
        return await ProductModel.findOneAndUpdate(
            { _id: productId },
            {
                $set: product,
            },
            {
                new: true,
            },
        );
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

    async delete(productId: string) {
        return await ProductModel.findByIdAndDelete(productId);
    }
}
