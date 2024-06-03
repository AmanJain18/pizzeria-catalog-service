import ProductModel from './productModel';
import { Product } from './productTypes';

export class ProductService {
    async create(product: Product) {
        const newProduct = new ProductModel(product);
        return await newProduct.save();
    }
}
