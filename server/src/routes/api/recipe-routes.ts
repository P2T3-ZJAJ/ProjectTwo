// server/src/routes/api/recipe-routes.ts
import express from 'express';
import type { Request, Response } from 'express';
import mealService from '../../services/mealService.js';
import nutritionService from '../../services/nutritionService.js';
import { Recipe, User, UserRecipe } from '../../models/index.js';

const router = express.Router();

// get a random recipe
router.get('/random', async (_req: Request, res: Response) => {
  try {
    const meals = await mealService.getRandomMeals();
    res.json(meals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// search recipes by name
router.get('/search/:name', async (req: Request, res: Response) => {
  try {
    const meals = await mealService.searchMealsByName(req.params.name);
    res.json(meals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// get all recipe categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await mealService.getCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// get recipes by category
router.get('/category/:name', async (req: Request, res: Response) => {
  try {
    const meals = await mealService.filterByCategory(req.params.name);
    res.json(meals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// get recipe by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const meal = await mealService.getMealById(req.params.id);
    res.json(meal);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// get nutrition information for ingredients
router.post('/nutrition', async (req: Request, res: Response) => {
    try {
      const { ingredients } = req.body;
      if (!ingredients) {
        return res.status(400).json({ message: 'Ingredients are required' });
      }
      
      const nutritionInfo = await nutritionService.getNutritionInfo(ingredients);
      return res.json(nutritionInfo);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

// add a recipe to user's favorites
router.post('/favorite', async (req: Request, res: Response) => {
  try {
    const { userId, mealId, mealData } = req.body;
    
    // check if the recipe already exists in our database
    let recipe = await Recipe.findOne({ where: { mealId } });
    
    // if not, create it
    if (!recipe) {
      recipe = await Recipe.create({
        mealId: mealData.idMeal,
        name: mealData.strMeal,
        category: mealData.strCategory,
        area: mealData.strArea,
        instructions: mealData.strInstructions,
        thumbnail: mealData.strMealThumb,
        youtubeLink: mealData.strYoutube
      });
    }
    
    // associate the recipe with the user
    await UserRecipe.create({
      userId,
      recipeId: recipe.id
    });
    
    res.status(201).json({ message: 'Recipe favorited successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// get user's favorite recipes
router.get('/favorites/:userId', async (req: Request, res: Response) => {
    try {
      const user = await User.findByPk(req.params.userId, {
        include: [Recipe]
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.json(user.get({ plain: true }).Recipes);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

// remove a recipe from user's favorites
router.delete('/favorite/:userId/:recipeId', async (req: Request, res: Response) => {
  try {
    const { userId, recipeId } = req.params;
    
    // find the recipe by mealId
    const recipe = await Recipe.findOne({ where: { mealId: recipeId } });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // find and remove the user-recipe association
    const deleted = await UserRecipe.destroy({
      where: {
        userId,
        recipeId: recipe.id
      }
    });
    
    if (deleted) {
      return res.json({ message: 'Recipe removed from favorites' });
    } else {
      return res.status(404).json({ message: 'Favorite not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// endpoint to check if a recipe is in favorites
router.get('/favorite/:userId/:recipeId', async (req: Request, res: Response) => {
  try {
    const { userId, recipeId } = req.params;
    
    // find the recipe by mealId
    const recipe = await Recipe.findOne({ where: { mealId: recipeId } });
    
    if (!recipe) {
      return res.json({ isFavorite: false });
    }
    
    // check if the association exists
    const favorite = await UserRecipe.findOne({
      where: {
        userId,
        recipeId: recipe.id
      }
    });
    
    return res.json({ isFavorite: !!favorite });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export { router as recipeRouter };