import { Link } from "react-router-dom";
import { Recipe } from "../interfaces/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="card h-100">
      <img
        src={recipe.strMealThumb}
        className="card-img-top"
        alt={recipe.strMeal}
      />
      <div className="card-body">
        <h5 className="card-title">{recipe.strMeal}</h5>
        <p className="card-text">
          <span className="badge bg-primary me-2">{recipe.strCategory}</span>
          <span className="badge bg-secondary">{recipe.strArea}</span>
        </p>
        <Link to={`/recipe/${recipe.idMeal}`} className="btn btn-primary">
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
