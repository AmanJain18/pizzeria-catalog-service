import ToppingModel from './toppingModel';
import { CreateTopping, UpdateTopping } from './toppingTypes';

export class ToppingService {
    async create(topping: CreateTopping) {
        const newTopping = new ToppingModel(topping);
        return await newTopping.save();
    }

    async getAll() {
        return await ToppingModel.find();
    }

    async getById(toppingId: string) {
        return await ToppingModel.findOne({ _id: toppingId });
    }

    async update(toppingId: string, topping: UpdateTopping) {
        return await ToppingModel.findByIdAndUpdate(
            {
                _id: toppingId,
            },
            {
                $set: topping,
            },
            {
                new: true,
            },
        );
    }

    async delete(toppingId: string) {
        return await ToppingModel.findByIdAndDelete(toppingId);
    }
}
