import { Category } from "../models/Category";

export class CategoryRepository {
    

    async create(name: String){
        const category = await Category.create({
            name
        })

        return category;
    }

    async getCategoryById(id: number){
        const category = await Category.findById({
            id
        })

        return category;
    }

    async getAllCategories(){
        return await Category.findAll();
    }
}