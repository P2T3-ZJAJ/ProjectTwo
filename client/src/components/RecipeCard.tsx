import { Link } from "react-router-dom";
import { Recipe } from "../interfaces/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="card h-100 border-0">
      <div className="card-img-container">
        <img
          src={recipe.strMealThumb}
          className="card-img-top"
          alt={recipe.strMeal}
        />
        <div className="card-badges">
          <span className="badge bg-primary">{recipe.strCategory}</span>
          <span className="badge bg-secondary ms-2">{recipe.strArea}</span>
        </div>
      </div>
      <div className="card-body d-flex flex-column p-4">
        <h5 className="card-title fw-bold mb-3">{recipe.strMeal}</h5>
        <p className="card-text text-muted mb-4">
          {recipe.strInstructions?.substring(0, 100)}...
        </p>
        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="btn btn-outline mt-auto"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
