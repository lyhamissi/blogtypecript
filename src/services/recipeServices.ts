import { AppDataSource } from '../config/database';
import { Recipe } from '../entities/Recipes';

export class RecipeService {
  private recipeRepo = AppDataSource.getRepository(Recipe);

  async createRecipe(data: Partial<Recipe>): Promise<Recipe> {
    const recipe = this.recipeRepo.create(data);
    return await this.recipeRepo.save(recipe);
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return await this.recipeRepo.find({
      order: { createdAt: 'DESC' },
      // eager relation 'addedBy' will be included automatically
    });
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    // Explicitly use findOne with where in case you want to add options later
    return await this.recipeRepo.findOne({
      where: { id },
      // addedBy is eager, so no need to add relations here
    });
  }

  async updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe | null> {
    const recipe = await this.recipeRepo.findOneBy({ id });
    if (!recipe) return null;

    this.recipeRepo.merge(recipe, data);
    return await this.recipeRepo.save(recipe);
  }

  async deleteRecipe(id: string): Promise<boolean> {
    const result = await this.recipeRepo.delete(id);
    return result.affected !== 0;
  }
}
