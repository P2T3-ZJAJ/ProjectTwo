import { Link } from "react-router-dom";
import auth from "../utils/auth";

const Home = () => {
  const isLoggedIn = auth.loggedIn();

  return (
    <div className="text-center my-5">
      <h1 className="display-4">Welcome to Foodfolio</h1>
      <p className="lead">Discover, save, and share your favorite recipes.</p>

      <div className="my-5">
        {isLoggedIn ? (
          <div>
            <p>You're logged in! Start exploring recipes.</p>
            <Link to="/recipes" className="btn btn-success btn-lg">
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div>
            <p>Sign in to discover and save delicious recipes.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/login" className="btn btn-primary btn-lg">
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline-primary btn-lg">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <h3>Find Recipes</h3>
          <p>Search hundreds of recipes from cuisines around the world.</p>
        </div>
        <div className="col-md-4">
          <h3>Nutrition Info</h3>
          <p>Get detailed nutrition information for every ingredient.</p>
        </div>
        <div className="col-md-4">
          <h3>Save Favorites</h3>
          <p>Create your personal collection of favorite recipes.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
