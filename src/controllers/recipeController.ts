import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { RecipeService } from '../services/recipeServices';

const recipeService = new RecipeService();

export const createRecipe = asyncHandler(async (req: Request, res: Response) => {
  const recipe = await recipeService.createRecipe(req.body);
  res.status(201).json(recipe);
});

export const getAllRecipes = asyncHandler(async (req: Request, res: Response) => {
  const recipes = await recipeService.getAllRecipes();
  res.json(recipes);
});

export const getRecipeById = asyncHandler(async (req: Request, res: Response) => {
  const recipe = await recipeService.getRecipeById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
});

export const updateRecipe = asyncHandler(async (req: Request, res: Response) => {
  const updatedRecipe = await recipeService.updateRecipe(req.params.id, req.body);
  if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(updatedRecipe);
});

export const deleteRecipe = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await recipeService.deleteRecipe(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Recipe not found' });
  res.json({ message: 'Recipe deleted successfully' });
});
