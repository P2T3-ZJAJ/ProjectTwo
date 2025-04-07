import { Link } from "react-router-dom";
import { Recipe } from "../interfaces/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  // function to truncate text
  const truncateText = (
    text: string | null | undefined,
    maxLength: number = 80
  ) => {
    if (!text) return ""; // handle null or undefined instructions
    return text.length > maxLength
      ? text.substring(0, maxLength).trim() + "..."
      : text;
  };

  return (
    <div className="recipe-card h-100">
      <div className="recipe-card-image-wrapper position-relative">
        <img
          src={recipe.strMealThumb}
          className="img-fluid"
          alt={recipe.strMeal}
          loading="lazy"
        />
        {(recipe.strCategory || recipe.strArea) && (
          <div className="recipe-badges position-absolute bottom-0 start-0 p-2">
            {recipe.strCategory && (
              <span className="badge recipe-badge category-badge me-1">
                {recipe.strCategory}
              </span>
            )}
            {recipe.strArea && (
              <span className="badge recipe-badge area-badge">
                {recipe.strArea}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="recipe-card-body p-3 d-flex flex-column">
        {" "}
        <h5 className="recipe-card-title mb-2">{recipe.strMeal}</h5>
        <p className="recipe-card-text flex-grow-1 mb-3">
          {" "}
          {truncateText(recipe.strInstructions)}
        </p>
        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="btn btn-recipe-view mt-auto align-self-start"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
