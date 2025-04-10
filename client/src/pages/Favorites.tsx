// client/src/pages/Favorites.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFavorites } from "../api/recipeAPI";
import RecipeCard from "../components/RecipeCard";
import auth from "../utils/auth";
import { Recipe } from "../interfaces/Recipe";

// Interface for database recipe format
interface DbRecipe {
  id: number;
  mealId: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  youtubeLink?: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadFavorites = async () => {
    try {
      if (!auth.loggedIn()) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError("");

      // Get the user ID from auth
      const userInfo = auth.getUserInfo();
      if (!userInfo.id) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      const favoritesData = await getFavorites(userInfo.id);
      
      // Transform database recipes to match API format expected by RecipeCard
      const transformedFavorites = favoritesData.map((dbRecipe: DbRecipe) => ({
        idMeal: dbRecipe.mealId,
        strMeal: dbRecipe.name,
        strCategory: dbRecipe.category,
        strArea: dbRecipe.area,
        strInstructions: dbRecipe.instructions,
        strMealThumb: dbRecipe.thumbnail,
        strYoutube: dbRecipe.youtubeLink || ''
      }));
      
      // Ensure we don't have duplicates
    const uniqueFavorites = transformedFavorites.filter((recipe: Recipe, index: number, self: Recipe[]) =>
      index === self.findIndex((r: Recipe) => r.idMeal === recipe.idMeal)
    );
      
      setFavorites(uniqueFavorites);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setError("Failed to load favorites. Please try again later.");
      setFavorites([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [navigate]);

  return (
    <div className="container mt-4 favorites-page">
      <div className="text-center mb-4">
        <h1 className="mb-2">My Favorite Recipes 📌</h1>
        
        {!loading && !error && favorites.length > 0 && (
          <div className="favorite-counter mt-2">
            <span className="badge bg-success rounded-pill px-3 py-2" style={{ fontSize: "0.95rem" }}>
              {favorites.length} {favorites.length === 1 ? 'Recipe' : 'Recipes'} Saved
            </span>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="text-center my-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && favorites.length === 0 && (
        <div className="text-center my-5">
          <p className="mb-3">You haven't saved any favorite recipes yet.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/recipes")}
          >
            <i className="bi bi-search me-2"></i>
            Browse Recipes
          </button>
        </div>
      )}
      
      <div className="row gy-5">
        {!loading && !error && favorites.length > 0 &&
          favorites.map((recipe) => (
            <div
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
              key={recipe.idMeal}
            >
              <div className="position-relative h-100">
                <RecipeCard 
                  recipe={recipe} 
                  showFavoriteIndicator={true}
                  onFavoriteToggle={loadFavorites}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Favorites;