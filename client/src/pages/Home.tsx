// client/src/pages/Home.tsx
import { Link } from "react-router-dom";
import auth from "../utils/auth";

const Home = () => {
  const isLoggedIn = auth.loggedIn();

  return (
    <>
      {/* Welcome Section */}
      <section className="welcome text-center">
        <div className="container">
          <h1>Welcome to Foodfolio!</h1>
          <p className="subtitle">
            Discover, save, and share your favorite recipes from around the
            world 🌎
          </p>

          {isLoggedIn && (
            <Link to="/recipes" className="button primary">
              <i className="bi bi-binoculars"></i> Explore
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h3>Find Recipes</h3>
                <p>
                  Search hundreds of recipes from cuisines around the world.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-bar-chart"></i>
                </div>
                <h3>Nutrition Info</h3>
                <p>Get detailed nutrition information for every ingredient.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-heart"></i>
                </div>
                <h3>Save Favorites</h3>
                <p>Create your personal collection of favorite recipes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
