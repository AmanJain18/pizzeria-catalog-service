import CategoryModel from './categoryModel';
import { Category } from './categoryTypes';

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }

    async getAll() {
        return CategoryModel.find();
    }
}
