import { Recipe } from '../interfaces/Recipe';
import Auth from '../utils/auth';

interface FavoriteResponse {
    message: string;
  }

// get random recipe
export const getRandomRecipe = async () => {
  try {
    const response = await fetch('/api/recipes/random', {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch random recipe');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    return [];
  }
};

// search recipes by name
export const searchRecipes = async (name: string) => {
  try {
    const response = await fetch(`/api/recipes/search/${name}`, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to search recipes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

// get recipe by id
export const getRecipeById = async (id: string) => {
  try {
    const response = await fetch(`/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};

// get nutrition info for ingredients
export const getNutritionInfo = async (ingredients: string) => {
  try {
    const response = await fetch('/api/recipes/nutrition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify({ ingredients })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch nutrition information');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    return [];
  }
};

// save recipe to favorites
export const saveRecipe = async (userId: number, mealId: string, mealData: Recipe): Promise<FavoriteResponse | null> => {
  try {
    const response = await fetch('/api/recipes/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify({ userId, mealId, mealData })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save recipe to favorites');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving recipe to favorites:', error);
    return null;
  }
};

// get user's favorite recipes
export const getFavorites = async (userId: number) => {
  try {
    const response = await fetch(`/api/recipes/favorites/${userId}`, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorite recipes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    return [];
  }
};