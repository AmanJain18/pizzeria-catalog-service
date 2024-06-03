import CategoryModel from './categoryModel';
import { Category } from './categoryTypes';

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);
        return await newCategory.save();
    }

    async getAll() {
        return await CategoryModel.find();
    }

    async getOne(categoryId: string) {
        return await CategoryModel.findOne({ _id: categoryId });
    }
}
