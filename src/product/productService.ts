import ProductModel from './productModel';
import { Product } from './productTypes';

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
}
