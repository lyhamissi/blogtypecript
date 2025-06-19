import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/common.types';  // your custom request type with user
import { RecipeService } from '../services/recipeServices';

const recipeService = new RecipeService();

export const createRecipe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    // if (!req.user) {
    //   return res.status(401).json({ success: false, code: 401, message: 'Unauthorized' });
    // }

    // data.addedById = req.user.id;

    const recipe = await recipeService.createRecipe(data);
    res.status(201).json({
      success: true,
      code: 201,
      message: 'Recipe created successfully',
      data: recipe,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllRecipes = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.json({
      success: true,
      code: 200,
      data: recipes,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecipeById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const recipe = await recipeService.getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ success: false, code: 404, message: 'Recipe not found' });
    }
    res.json({
      success: true,
      code: 200,
      data: recipe,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRecipe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const recipe = await recipeService.getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ success: false, code: 404, message: 'Recipe not found' });
    }

    // Optional authorization check
    // if (recipe.addedById !== req.user?.id) {
    //   return res.status(403).json({ success: false, code: 403, message: 'Not authorized' });
    // }

    const updatedRecipe = await recipeService.updateRecipe(id, data);
    res.json({
      success: true,
      code: 200,
      message: 'Recipe updated successfully',
      data: updatedRecipe,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRecipe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const recipe = await recipeService.getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ success: false, code: 404, message: 'Recipe not found' });
    }

    // Optional authorization check
    // if (recipe.addedById !== req.user?.id) {
    //   return res.status(403).json({ success: false, code: 403, message: 'Not authorized' });
    // }

    const success = await recipeService.deleteRecipe(id);
    if (success) {
      res.json({
        success: true,
        code: 200,
        message: 'Recipe deleted successfully',
      });
    } else {
      res.status(500).json({ success: false, code: 500, message: 'Failed to delete recipe' });
    }
  } catch (err) {
    next(err);
  }
};
