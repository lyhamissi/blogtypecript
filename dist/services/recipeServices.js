import { AppDataSource } from '../config/database';
import { Recipe } from '../entities/Recipes';
export class RecipeService {
    constructor() {
        this.recipeRepo = AppDataSource.getRepository(Recipe);
    }
    async createRecipe(data) {
        const recipe = this.recipeRepo.create(data);
        return await this.recipeRepo.save(recipe);
    }
    async getAllRecipes() {
        return await this.recipeRepo.find({
            order: { createdAt: 'DESC' },
            // eager relation 'addedBy' will be included automatically
        });
    }
    async getRecipeById(id) {
        // Explicitly use findOne with where in case you want to add options later
        return await this.recipeRepo.findOne({
            where: { id },
            // addedBy is eager, so no need to add relations here
        });
    }
    async updateRecipe(id, data) {
        const recipe = await this.recipeRepo.findOneBy({ id });
        if (!recipe)
            return null;
        this.recipeRepo.merge(recipe, data);
        return await this.recipeRepo.save(recipe);
    }
    async deleteRecipe(id) {
        const result = await this.recipeRepo.delete(id);
        return result.affected !== 0;
    }
}
