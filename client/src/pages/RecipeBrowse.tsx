import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomRecipe, searchRecipes } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import RecipeCard from '../components/RecipeCard';
import SearchForm from '../components/SearchForm';
import auth from '../utils/auth';

const RecipeBrowse = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // load random recipe on initial page load
  useEffect(() => {
    const loadRandomRecipe = async () => {
      try {
        if (!auth.loggedIn()) {
          navigate('/login');
          return;
        }

        setLoading(true);
        const randomRecipes = await getRandomRecipe();
        setRecipes(randomRecipes);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load random recipe:', err);
        setError('Failed to load recipes. Please try again.');
        setLoading(false);
      }
    };

    loadRandomRecipe();
  }, [navigate]);

  // handle search submission
  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const searchResults = await searchRecipes(query);
      setRecipes(searchResults);
      setLoading(false);
    } catch (err) {
      console.error('Failed to search recipes:', err);
      setError('Failed to search recipes. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Find Your Next Meal</h1>

      <SearchForm onSearch={handleSearch} />

      {loading && <p>Loading recipes...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="row">
        {recipes && recipes.length > 0 ? (
          recipes.map(recipe => (
            <div className="col-md-4 mb-4" key={recipe.idMeal}>
              <RecipeCard recipe={recipe} />
            </div>
          ))
        ) : (
          !loading && <p>No recipes found. Try another search term.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeBrowse;