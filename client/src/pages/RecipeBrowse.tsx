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

  useEffect(() => {
    const loadInitialRecipes = async (targetCount: number = 20) => {
      try {
        if (!auth.loggedIn()) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError("");

        const uniqueRecipeMap = new Map<string, Recipe>();
        let totalFetchAttempts = 0; // safety counter
        const maxFetchAttempts = targetCount * 2;

        while (
          uniqueRecipeMap.size < targetCount &&
          totalFetchAttempts < maxFetchAttempts
        ) {
          const needed = targetCount - uniqueRecipeMap.size;
          // console.log(`Need ${needed} more recipes. Current unique count: ${uniqueRecipeMap.size}. Fetch attempts: ${totalFetchAttempts}`);

          const recipePromises: Promise<Recipe[]>[] = [];
          for (let i = 0; i < needed; i++) {
            if (totalFetchAttempts < maxFetchAttempts) {
              recipePromises.push(getRandomRecipe());
              totalFetchAttempts++;
            } else {
              // console.warn("Max fetch attempts reached while preparing promises.");
              break;
            }
          }
          if (recipePromises.length === 0) {
            break;
          }

          const results = await Promise.all(recipePromises);
          const fetchedRecipes = results.flat().filter(Boolean) as Recipe[];

          for (const recipe of fetchedRecipes) {
            if (
              recipe?.idMeal &&
              !uniqueRecipeMap.has(recipe.idMeal) &&
              uniqueRecipeMap.size < targetCount
            ) {
              uniqueRecipeMap.set(recipe.idMeal, recipe);
            }
          }
        }

        if (uniqueRecipeMap.size < targetCount) {
          console.warn(
            `Could only fetch ${uniqueRecipeMap.size} unique recipes after ${totalFetchAttempts} attempts. Target was ${targetCount}.`
          );
        }

        const finalUniqueRecipes = Array.from(uniqueRecipeMap.values());

        setRecipes(finalUniqueRecipes);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load initial recipes:", err);
        setError("Failed to load recipes. Please try again later.");
        setRecipes([]); // clear recipes on error
        setLoading(false);
      }
    };

    loadInitialRecipes(20); // call the function to load 20 unique recipes
  }, [navigate]); // navigate is the only external dependency needed here

  // handle search submission (no changes needed here)
  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(""); // clear previous errors
      const searchResults = await searchRecipes(query);
      // handle cases where searchResults might be null or not an array
      setRecipes(
        searchResults && Array.isArray(searchResults) ? searchResults : []
      );
      setLoading(false);
    } catch (err) {
      console.error("Failed to search recipes:", err);
      setError("Failed to search recipes. Please try again.");
      setRecipes([]); // clear recipes on search error
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
