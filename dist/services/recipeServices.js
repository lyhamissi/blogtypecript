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
exports.RecipeService = void 0;
const database_1 = require("../config/database");
const Recipes_1 = require("../entities/Recipes");
class RecipeService {
    constructor() {
        this.recipeRepo = database_1.AppDataSource.getRepository(Recipes_1.Recipe);
    }
    createRecipe(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipe = this.recipeRepo.create(data);
            return yield this.recipeRepo.save(recipe);
        });
    }
    getAllRecipes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.recipeRepo.find({
                order: { createdAt: 'DESC' },
                // eager relation 'addedBy' will be included automatically
            });
        });
    }
    getRecipeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Explicitly use findOne with where in case you want to add options later
            return yield this.recipeRepo.findOne({
                where: { id },
                // addedBy is eager, so no need to add relations here
            });
        });
    }
    updateRecipe(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipe = yield this.recipeRepo.findOneBy({ id });
            if (!recipe)
                return null;
            this.recipeRepo.merge(recipe, data);
            return yield this.recipeRepo.save(recipe);
        });
    }
    deleteRecipe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.recipeRepo.delete(id);
            return result.affected !== 0;
        });
    }
}
exports.RecipeService = RecipeService;
