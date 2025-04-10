// client/src/components/RecipeCard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "../interfaces/Recipe";
import { checkIsFavorite, saveRecipe, removeRecipe } from "../api/recipeAPI";
import auth from "../utils/auth";

interface RecipeCardProps {
  recipe: Recipe;
  showFavoriteIndicator?: boolean;
  onFavoriteToggle?: () => void; // Callback for parent components to refresh their data
}

const RecipeCard = ({ recipe, showFavoriteIndicator = true, onFavoriteToggle }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (showFavoriteIndicator && auth.loggedIn()) {
        const userInfo = auth.getUserInfo();
        if (userInfo.id) {
          const favoriteStatus = await checkIsFavorite(userInfo.id, recipe.idMeal);
          setIsFavorite(favoriteStatus);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [recipe.idMeal, showFavoriteIndicator]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to recipe detail
    e.stopPropagation(); // Prevent event bubbling
    
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const userInfo = auth.getUserInfo();
      if (!userInfo.id) {
        console.error("User not logged in or ID not found");
        setIsUpdating(false);
        return;
      }
      
      let result;
      if (isFavorite) {
        // Remove from favorites
        result = await removeRecipe(userInfo.id, recipe.idMeal);
        if (result) {
          setIsFavorite(false);
        }
      } else {
        // Add to favorites
        result = await saveRecipe(userInfo.id, recipe.idMeal, recipe);
        if (result) {
          setIsFavorite(true);
        }
      }
      
      // Call the callback if provided
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    } catch (err) {
      console.error("Failed to update favorite status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // format title function (unchanged)
  const formatTitle = (title: string | null | undefined): string => {
    if (!title) return "";
    const properCase = title.replace(
      /\b\w+/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return properCase.replace(/ and /gi, " & ").replace(/ with /gi, " w/ ");
  };

  return (
    <div className="recipe-card-container" style={{ height: "100%" }}>
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
            position: "relative", // Add this for absolute positioning of heart icon
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
      
      {showFavoriteIndicator && (
        <button
          onClick={handleFavoriteToggle}
          className="favorite-btn"
          disabled={isUpdating}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            border: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <i 
            className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} 
            style={{ 
              color: isFavorite ? "#e74c3c" : "#666",
              fontSize: "1.2rem"
            }}
          ></i>
        </button>
      )}
    </div>
  );
};

export default RecipeCard;