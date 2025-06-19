import { Router } from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController'; 
import { authMiddleware } from '../middlewares/authMiddleware';
import upload from '../middlewares/multer';
const router = Router();


router.post('/create', createRecipe as any);
router.get('/', getAllRecipes);

router.get('/:id', getRecipeById as any);
router.put('/:id', updateRecipe as any);
router.delete('/:id', deleteRecipe as any);

export default router;
