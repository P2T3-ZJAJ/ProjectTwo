import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomRecipe, searchRecipes } from "../api/recipeAPI";
import { Recipe } from "../interfaces/Recipe";
import RecipeCard from "../components/RecipeCard";
import SearchForm from "../components/SearchForm";
import auth from "../utils/auth";

const RecipeBrowse = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // load multiple random recipes on initial page load
  useEffect(() => {
    const loadInitialRecipes = async (count: number = 20) => {
      try {
        if (!auth.loggedIn()) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError(""); // clear previous errors

        // array to hold promises for fetching each recipe
        const recipePromises: Promise<Recipe[]>[] = [];
        for (let i = 0; i < count; i++) {
          recipePromises.push(getRandomRecipe());
        }

        // wait for all promises to resolve
        const results = await Promise.all(recipePromises);

        const fetchedRecipes = results.flat().filter(Boolean) as Recipe[];

        // prevent duplicates in case the random API might return the same recipe
        const uniqueRecipes = Array.from(
          new Map(
            fetchedRecipes.map((recipe) => [recipe.idMeal, recipe])
          ).values()
        );

        setRecipes(uniqueRecipes);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load initial recipes:", err);
        setError("Failed to load recipes. Please try again later.");
        setLoading(false);
      }
    };

    loadInitialRecipes(); // call the function to load recipes
  }, [navigate]);

  // handle search submission (no changes needed here)
  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const searchResults = await searchRecipes(query);
      // Handle cases where searchResults might be null or not an array
      setRecipes(
        searchResults && Array.isArray(searchResults) ? searchResults : []
      );
      setLoading(false);
    } catch (err) {
      console.error("Failed to search recipes:", err);
      setError("Failed to search recipes. Please try again.");
      setRecipes([]); // Clear recipes on search error
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {" "}
      <div className="row mb-4">
        <div className="col-12">
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>
      {loading && (
        <div className="text-center my-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            {" "}
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row gy-5">
        {!loading && !error && recipes.length > 0
          ? recipes.map((recipe) => (
              <div
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                key={recipe.idMeal}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))
          : !loading &&
            !error && (
              <div className="col-12">
                <p className="text-center text-muted mt-5">
                  No recipes found. Try searching for something delicious!
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default RecipeBrowse;
