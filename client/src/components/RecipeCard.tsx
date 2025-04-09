import { Link } from "react-router-dom";
import { Recipe } from "../interfaces/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  // format title function
  const formatTitle = (title: string | null | undefined): string => {
    if (!title) return "";
    const properCase = title.replace(
      /\b\w+/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return properCase.replace(/ and /gi, " & ").replace(/ with /gi, " w/ ");
  };

  return (
    <Link
      to={`/recipe/${recipe.idMeal}`}
      className="text-decoration-none"
      style={{
        display: "block",
        height: "100%",
        textDecoration: "none",
      }}
    >
      <div
        className="recipe-card h-100"
        style={{
          transition: "all 0.3s ease",
          cursor: "pointer",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="recipe-card-image-wrapper">
          <img
            src={recipe.strMealThumb}
            className="img-fluid"
            alt={formatTitle(recipe.strMeal)}
            loading="lazy"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          className="recipe-card-body pt-0 px-3 pb-3 d-flex flex-column"
          style={{ height: "calc(100% - 180px)" }}
        >
          <h5
            className="recipe-card-title"
            style={{
              color: "#333",
              fontSize: "1.1rem",
              margin: "4px 0 4px 0",
              lineHeight: "1.3",
            }}
          >
            {formatTitle(recipe.strMeal)}
          </h5>

          <div style={{ marginBottom: "8px" }}>
            {recipe.strCategory && recipe.strArea && (
              <p
                style={{
                  fontSize: "0.85rem",
                  margin: "0",
                  padding: "0",
                  color: "#666",
                  lineHeight: "1.3",
                }}
              >
                <span
                  style={{
                    fontWeight: "500",
                    color: "#2ecc71",
                    marginRight: "5px",
                  }}
                >
                  {recipe.strCategory}
                </span>
                •
                <span
                  style={{
                    fontWeight: "500",
                    color: "#3498db",
                    marginLeft: "5px",
                  }}
                >
                  {recipe.strArea}
                </span>
              </p>
            )}
          </div>

          <p
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.9rem",
              lineHeight: "1.4",
              color: "#666",
              margin: '0',
              padding: "0",
            }}
          >
            {recipe.strInstructions}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
