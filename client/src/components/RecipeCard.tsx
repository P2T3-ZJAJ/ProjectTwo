import { Link } from "react-router-dom";
import { Recipe } from "../interfaces/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="card h-100 shadow-sm hover-shadow">
      <img
        src={recipe.strMealThumb}
        className="card-img-top recipe-card-image"
        alt={recipe.strMeal}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{recipe.strMeal}</h5>
        <div className="mb-2">
          <span className="badge bg-primary me-2">{recipe.strCategory}</span>
          <span className="badge bg-secondary">{recipe.strArea}</span>
        </div>
        <p className="card-text small text-muted">
          {recipe.strInstructions?.substring(0, 80)}...
        </p>
        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="btn btn-primary mt-auto"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
