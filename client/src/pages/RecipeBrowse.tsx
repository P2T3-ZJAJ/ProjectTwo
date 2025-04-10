import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomRecipe, searchRecipes } from "../api/recipeAPI";
import { Recipe } from "../interfaces/Recipe";
import RecipeCard from "../components/RecipeCard";
import SearchForm from "../components/SearchForm";
import auth from "../utils/auth";

const RecipeBrowse = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRecipeElementRef = useRef<HTMLDivElement | null>(null);
  const recipesMap = useRef(new Map<string, Recipe>());
  const navigate = useNavigate();

  const fetchMoreRecipes = useCallback(
    async (isInitialLoad = false, currentQuery = searchQuery) => {
      try {
        const batchSize = isInitialLoad ? 8 : 4;
        const maxAttempts = batchSize * 3;
        let attempts = 0;
        let newRecipesCount = 0;

        if (currentQuery && currentQuery.trim() !== "") {
          // Search mode logic
          if (!isInitialLoad) {
            setHasMore(false);
            return;
          }

          const searchResults = await searchRecipes(currentQuery);
          if (searchResults && Array.isArray(searchResults)) {
            const uniqueRecipes = searchResults.filter(
              (recipe) => !recipesMap.current.has(recipe.idMeal)
            );

            uniqueRecipes.forEach((recipe) => {
              recipesMap.current.set(recipe.idMeal, recipe);
            });

            setRecipes(Array.from(recipesMap.current.values()));
            setHasMore(false);
          }
          return;
        }

        while (newRecipesCount < batchSize && attempts < maxAttempts) {
          attempts++;
          const newRecipesBatch = await getRandomRecipe();

          if (
            newRecipesBatch &&
            Array.isArray(newRecipesBatch) &&
            newRecipesBatch.length > 0
          ) {
            const recipe = newRecipesBatch[0];

            if (
              recipe &&
              recipe.idMeal &&
              !recipesMap.current.has(recipe.idMeal)
            ) {
              recipesMap.current.set(recipe.idMeal, recipe);
              newRecipesCount++;
            }
          }
        }

        setRecipes(Array.from(recipesMap.current.values()));

        if (newRecipesCount < batchSize) {
          console.warn(
            "Could not find enough new recipes. May be approaching limit."
          );
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching more recipes:", error);
        setError("Error loading more recipes. Please try again.");
        setHasMore(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    const loadInitialRecipes = async () => {
      try {
        if (!auth.loggedIn()) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError("");
        recipesMap.current.clear();

        await fetchMoreRecipes(true);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load initial recipes:", err);
        setError("Failed to load recipes. Please try again later.");
        setRecipes([]);
        setLoading(false);
        setHasMore(false);
      }
    };

    loadInitialRecipes();
  }, [navigate, fetchMoreRecipes]);

  const loadMoreRecipes = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    fetchMoreRecipes().finally(() => {
      setLoadingMore(false);
    });
  }, [loadingMore, hasMore, fetchMoreRecipes]);

  useEffect(() => {
    if (loading || !hasMore) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadMoreRecipes();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (lastRecipeElementRef.current) {
      observer.current.observe(lastRecipeElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, recipes.length, loadMoreRecipes]);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError("");
      recipesMap.current.clear();

      setSearchQuery(query);

      if (query.trim() === "") {
        setHasMore(true);
        await fetchMoreRecipes(true, "");
      } else {
        await fetchMoreRecipes(true, query);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to search recipes:", err);
      setError("Failed to search recipes. Please try again.");
      setRecipes([]);
      setLoading(false);
      setHasMore(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <SearchForm
            onSearch={handleSearch}
            initialSearchTerm={searchQuery}
            onClear={() => handleSearch("")}
          />
        </div>
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

      <div className="row gy-5">
        {!loading && !error && recipes.length > 0
          ? recipes.map((recipe, index) => (
              <div
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                key={recipe.idMeal}
                ref={index === recipes.length - 1 ? lastRecipeElementRef : null}
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

      {loadingMore && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading more...</span>
          </div>
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <div className="text-center my-4">
          <p className="text-muted">
            {searchQuery
              ? "All matching recipes have been loaded."
              : "You've reached the end of our recipe collection!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeBrowse;
