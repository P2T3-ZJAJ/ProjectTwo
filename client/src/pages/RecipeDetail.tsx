// client/src/pages/RecipeDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, getNutritionInfo, saveRecipe } from "../api/recipeAPI";
import { Recipe } from "../interfaces/Recipe";
import { NutritionItem } from "../interfaces/Nutrition";
import auth from "../utils/auth";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        if (!auth.loggedIn()) {
          navigate("/login");
          return;
        }

        if (!id) return;

        setLoading(true);
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);

        // get ingredients list for nutrition API
        if (recipeData) {
          const ingredients = getIngredientsList(recipeData);
          const nutritionData = await getNutritionInfo(ingredients);
          setNutritionInfo(nutritionData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load recipe details:", err);
        setError("Failed to load recipe details. Please try again.");
        setLoading(false);
      }
    };

    loadRecipeDetails();
  }, [id, navigate]);

  // helper function to extract ingredients list
  const getIngredientsList = (recipe: Recipe): string => {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
      const measure = recipe[`strMeasure${i}` as keyof Recipe];

      if (ingredient && String(ingredient).trim() !== "") {
        ingredients += `${measure} ${ingredient}, `;
      }
    }
    return ingredients.slice(0, -2); // remove trailing comma and space
  };

  // save recipe to favorites
  const handleSaveRecipe = async () => {
    try {
      if (!recipe) return;

      setSavingFavorite(true);
      // Note: need to get the actual user ID from auth or context
      const userId = 1; // Placeholder - replace with actual user ID
      const result = await saveRecipe(userId, recipe.idMeal, recipe);

      if (result) {
        setSaveMessage("Recipe saved to favorites!");
        setTimeout(() => setSaveMessage(""), 3000);
      }

      setSavingFavorite(false);
    } catch (err) {
      console.error("Failed to save recipe:", err);
      setError("Failed to save recipe. Please try again.");
      setSavingFavorite(false);
    }
  };

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="img-fluid rounded mb-3"
          />

          <h1>{recipe.strMeal}</h1>

          <div className="mb-3">
            <span className="badge bg-primary me-2">{recipe.strCategory}</span>
            <span className="badge bg-secondary">{recipe.strArea}</span>
          </div>

          <button
            className="btn btn-success mb-4"
            onClick={handleSaveRecipe}
            disabled={savingFavorite}
          >
            {savingFavorite ? "Saving..." : "Save to Favorites"}
          </button>

          {saveMessage && <p className="text-success">{saveMessage}</p>}

          {recipe.strYoutube && (
            <div className="mb-4">
              <h3>Video Tutorial</h3>
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-danger"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h3>Ingredients</h3>
          <ul className="list-group mb-4">
            {Array.from({ length: 20 }).map((_, i) => {
              const ingredient =
                recipe[`strIngredient${i + 1}` as keyof Recipe];
              const measure = recipe[`strMeasure${i + 1}` as keyof Recipe];

              if (ingredient && String(ingredient).trim() !== "") {
                return (
                  <li key={i} className="list-group-item">
                    {measure} {ingredient}
                  </li>
                );
              }
              return null;
            })}
          </ul>

          <h3>Instructions</h3>
          <p>{recipe.strInstructions}</p>
        </div>
      </div>

      {nutritionInfo.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <h3>Nutrition Information</h3>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Carbs</th>
                    <th>Fat</th>
                    <th>Fiber</th>
                    <th>Sugar</th>
                  </tr>
                </thead>
                <tbody>
                  {nutritionInfo.map((item, index) => (
                    <tr key={index}>
                      <td>{item.food_name}</td>
                      <td>{item.nf_calories.toFixed(1)}</td>
                      <td>{item.nf_protein.toFixed(1)}g</td>
                      <td>{item.nf_total_carbohydrate.toFixed(1)}g</td>
                      <td>{item.nf_total_fat.toFixed(1)}g</td>
                      <td>{item.nf_dietary_fiber.toFixed(1)}g</td>
                      <td>{item.nf_sugars.toFixed(1)}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
