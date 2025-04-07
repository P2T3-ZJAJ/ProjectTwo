import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
      // reset states on ID change
      setLoading(true);
      setError("");
      setRecipe(null);
      setNutritionInfo([]);

      try {
        if (!auth.loggedIn()) {
          navigate("/login");
          return;
        }
        if (!id) {
          setError("Recipe ID is missing.");
          setLoading(false);
          return;
        }

        const recipeData = await getRecipeById(id);
        if (!recipeData) {
          setError("Recipe not found.");
          setLoading(false);
          return;
        }
        setRecipe(recipeData);

        // get ingredients list for nutrition API
        const ingredients = getIngredientsList(recipeData);
        if (ingredients) {
          // only fetch nutrition if ingredients exist
          try {
            const nutritionData = await getNutritionInfo(ingredients);
            setNutritionInfo(nutritionData);
          } catch (nutriErr) {
            console.warn("Failed to load nutrition info:", nutriErr);
            // don't block the page load for nutrition errors, maybe show a message later
          }
        }
      } catch (err) {
        console.error("Failed to load recipe details:", err);
        setError("Failed to load recipe details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetails();
  }, [id, navigate]);

  const getIngredientsList = (recipe: Recipe): string => {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
      const measure = recipe[`strMeasure${i}` as keyof Recipe];
      if (ingredient && String(ingredient).trim() !== "") {
        // combine measure and ingredient, handling cases where measure might be empty/null
        ingredients += `${measure ? String(measure).trim() + " " : ""}${String(
          ingredient
        ).trim()}, `;
      }
    }
    return ingredients.trim().replace(/,$/, ""); // emove trailing comma and space if exists
  };

  // save recipe to favorites
  const handleSaveRecipe = async () => {
    try {
      if (!recipe) return;

      setSavingFavorite(true);
      // need to get the actual user ID from auth or context
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

  // loading and error states
  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Recipe...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger" role="alert">
          {error} -{" "}
          <Link to="/recipes" className="alert-link">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }
  if (!recipe) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning" role="alert">
          Recipe not found.{" "}
          <Link to="/recipes" className="alert-link">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container recipe-detail-page my-4 my-lg-5">
      {" "}
      {/* Added lg margin */}
      <div className="row mb-4 align-items-center recipe-detail-header">
        <div className="col-lg-6">
          <h1 className="recipe-title mb-2">{recipe.strMeal}</h1>
          {(recipe.strCategory || recipe.strArea) && (
            <div className="recipe-card-meta mb-3">
              {recipe.strCategory && (
                <span className="recipe-category me-2">
                  {recipe.strCategory}
                </span>
              )}
              {recipe.strArea && (
                <span className="recipe-area">{recipe.strArea}</span>
              )}
            </div>
          )}
          <div className="recipe-actions mb-3">
            <button
              className="btn btn-save-favorite me-2"
              onClick={handleSaveRecipe}
              disabled={savingFavorite}
            >
              {savingFavorite ? "Saving..." : "Save Recipe"}
            </button>
            {recipe.strYoutube && (
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-youtube"
              >
                Watch Tutorial
              </a>
            )}
          </div>
          {saveMessage && (
            <p className="text-success small mb-0">{saveMessage}</p>
          )}
        </div>
        <div className="col-lg-6 mt-3 mt-lg-0">
          <div className="recipe-image-container">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="img-fluid recipe-detail-image"
            />
          </div>
        </div>
      </div>
      <div className="row g-lg-5">
        <div className="col-lg-5 mb-4 mb-lg-0">
          <div className="recipe-detail-section">
            <h3 className="section-title mb-3">Ingredients</h3>
            <ul className="recipe-ingredients-list list-unstyled">
              {Array.from({ length: 20 }).map((_, i) => {
                const ingredient =
                  recipe[`strIngredient${i + 1}` as keyof Recipe];
                const measure = recipe[`strMeasure${i + 1}` as keyof Recipe];
                if (ingredient && String(ingredient).trim() !== "") {
                  return (
                    <li key={i} className="ingredient-item">
                      <span className="measure">
                        {measure ? String(measure).trim() : ""}
                      </span>
                      <span className="ingredient">
                        {String(ingredient).trim()}
                      </span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="recipe-detail-section">
            <h3 className="section-title mb-3">Instructions</h3>
            <div className="recipe-instructions">
              {recipe.strInstructions
                ?.split("\n")
                .map(
                  (line, index) =>
                    line.trim() && <p key={index}>{line.trim()}</p>
                )}
            </div>
          </div>
        </div>
      </div>
      {nutritionInfo.length > 0 && (
        <div className="row mt-4 mt-lg-5">
          <div className="col-12">
            <div className="recipe-detail-section">
              <h3 className="section-title mb-3">Nutrition Information</h3>
              <p className="text-muted small mb-3">
                Approximate values per serving based on ingredients listed.
              </p>
              <div className="table-responsive">
                <table className="table nutrition-table">
                  <thead>
                    <tr>
                      <th>Nutrient</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionInfo.map((item, index) => (
                      <tr key={index}>
                        <td>{item.food_name || "Total"}</td>
                        <td>
                          {item.nf_calories !== undefined
                            ? `${item.nf_calories.toFixed(0)} kcal`
                            : "-"}{" "}
                          | P:{" "}
                          {item.nf_protein !== undefined
                            ? `${item.nf_protein.toFixed(1)}g`
                            : "-"}{" "}
                          | C:{" "}
                          {item.nf_total_carbohydrate !== undefined
                            ? `${item.nf_total_carbohydrate.toFixed(1)}g`
                            : "-"}{" "}
                          | F:{" "}
                          {item.nf_total_fat !== undefined
                            ? `${item.nf_total_fat.toFixed(1)}g`
                            : "-"}{" "}
                          | Fib:{" "}
                          {item.nf_dietary_fiber !== undefined
                            ? `${item.nf_dietary_fiber.toFixed(1)}g`
                            : "-"}{" "}
                          | Sug:{" "}
                          {item.nf_sugars !== undefined
                            ? `${item.nf_sugars.toFixed(1)}g`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
