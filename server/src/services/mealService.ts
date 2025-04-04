// server/src/services/mealService.ts
interface MealResponse {
  meals: Meal[] | null;
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

class MealService {
    private baseUrl = 'https://www.themealdb.com/api/json/v1/1';
  
    // get random meals
    async getRandomMeals(): Promise<Meal[]> {
      try {
        const response = await fetch(`${this.baseUrl}/random.php`);
        const data = await response.json() as MealResponse;
        return data.meals || [];
      } catch (error) {
        console.error('Error fetching random meal:', error);
        return [];
      }
    }
  
    // search meals by name
    async searchMealsByName(name: string): Promise<Meal[]> {
      try {
        const response = await fetch(`${this.baseUrl}/search.php?s=${name}`);
        const data = await response.json() as MealResponse;
        return data.meals || [];
      } catch (error) {
        console.error('Error searching meals:', error);
        return [];
      }
    }
  
    // get meal by id
    async getMealById(id: string): Promise<Meal | null> {
      try {
        const response = await fetch(`${this.baseUrl}/lookup.php?i=${id}`);
        const data = await response.json() as MealResponse;
        return data.meals && data.meals.length > 0 ? data.meals[0] : null;
      } catch (error) {
        console.error('Error fetching meal by ID:', error);
        return null;
      }
    }
  
    // list all meal categories
    async getCategories(): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/categories.php`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching categories:', error);
        return { categories: [] };
      }
    }
  
    // filter by category
    async filterByCategory(category: string): Promise<Meal[]> {
      try {
        const response = await fetch(`${this.baseUrl}/filter.php?c=${category}`);
        const data = await response.json() as MealResponse;
        return data.meals || [];
      } catch (error) {
        console.error('Error filtering by category:', error);
        return [];
      }
    }
  }
  
  export default new MealService();