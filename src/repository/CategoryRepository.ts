import { Category, CategoryAttributes } from "../models/Category";
import sequelize from "../config/database";

export class CategoryRepository {

    private categoryModel: typeof Category;

    constructor(){
        this.categoryModel = sequelize.model('Category');
    }
    

    async create(categoryData: Omit<CategoryAttributes, 'id'>){
        const existingCategory = await this.categoryModel.findOne({
            where: {
                name: categoryData.name,
            },
        });

        if(existingCategory){
            throw new Error('Category already exists');
        }

        return await Category.create(categoryData)
    }

    async findById(id: number): Promise<Category | null>{
        return await Category.findByPk(id)
    }

    async getAllCategories(){
        return await Category.findAll();
    }

    async update(id: number, categoryData: Partial<Category>){
        
    }
}