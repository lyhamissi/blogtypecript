"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.updateRecipe = exports.getRecipeById = exports.getAllRecipes = exports.createRecipe = void 0;
const recipeServices_1 = require("../services/recipeServices");
const recipeService = new recipeServices_1.RecipeService();
const createRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        // if (!req.user) {
        //   return res.status(401).json({ success: false, code: 401, message: 'Unauthorized' });
        // }
        // data.addedById = req.user.id;
        const recipe = yield recipeService.createRecipe(data);
        res.status(201).json({
            success: true,
            code: 201,
            message: 'Recipe created successfully',
            data: recipe,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createRecipe = createRecipe;
const getAllRecipes = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield recipeService.getAllRecipes();
        res.json({
            success: true,
            code: 200,
            data: recipes,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllRecipes = getAllRecipes;
const getRecipeById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const recipe = yield recipeService.getRecipeById(id);
        if (!recipe) {
            return res.status(404).json({ success: false, code: 404, message: 'Recipe not found' });
        }
        res.json({
            success: true,
            code: 200,
            data: recipe,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getRecipeById = getRecipeById;
const updateRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const recipe = yield recipeService.getRecipeById(id);
        if (!recipe) {
            return res.status(404).json({ success: false, code: 404, message: 'Recipe not found' });
        }
        // Optional authorization check
        // if (recipe.addedById !== req.user?.id) {
        //   return res.status(403).json({ success: false, code: 403, message: 'Not authorized' });
        // }
        const updatedRecipe = yield recipeService.updateRecipe(id, data);
        res.json({
            success: true,
            code: 200,
            message: 'Recipe updated successfully',
            data: updatedRecipe,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateRecipe = updateRecipe;
const deleteRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const recipe = yield recipeService.getRecipeById(id);
        if (!recipe) {
            return res.status(404).json({ success: false, code: 404, message: 'Recipe not found' });
        }
        // Optional authorization check
        // if (recipe.addedById !== req.user?.id) {
        //   return res.status(403).json({ success: false, code: 403, message: 'Not authorized' });
        // }
        const success = yield recipeService.deleteRecipe(id);
        if (success) {
            res.json({
                success: true,
                code: 200,
                message: 'Recipe deleted successfully',
            });
        }
        else {
            res.status(500).json({ success: false, code: 500, message: 'Failed to delete recipe' });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.deleteRecipe = deleteRecipe;
