import { CategoryService } from "../services/CategoryService";


export class CategoryController {
    private categoryService: CategoryService;


    constructor(){
        this.categoryService = new CategoryService();
    }

    async createCategory(req: Request, res: Response) : Promise<void> {
        
    }
}