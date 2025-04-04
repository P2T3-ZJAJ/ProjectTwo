interface NutritionResponse {
  foods: NutritionItem[];
}

export interface NutritionItem {
  food_name: string;
  nf_calories: number;
  nf_total_fat: number;
  nf_saturated_fat: number;
  nf_cholesterol: number;
  nf_sodium: number;
  nf_total_carbohydrate: number;
  nf_dietary_fiber: number;
  nf_sugars: number;
  nf_protein: number;
  nf_potassium: number;
}

class NutritionService {
    private appId = '3621d19d';
    private appKey = '8cbda28d62849e86a58521ff835a99e6';
    private baseUrl = 'https://trackapi.nutritionix.com/v2';
  
    // get nutrition info for a natural language query
    async getNutritionInfo(query: string): Promise<NutritionItem[]> {
      try {
        const response = await fetch(`${this.baseUrl}/natural/nutrients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-app-id': this.appId,
            'x-app-key': this.appKey
          },
          body: JSON.stringify({
            query: query
          })
        });
        
        const data = await response.json() as NutritionResponse;
        return data.foods || [];
      } catch (error) {
        console.error('Error fetching nutrition info:', error);
        return [];
      }
    }
  }
  
  export default new NutritionService();