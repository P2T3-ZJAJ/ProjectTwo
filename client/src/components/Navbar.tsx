import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import auth from "../utils/auth";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(auth.loggedIn());
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo-wrapper">
          <img
            src="/assets/images/foodfolio-logo.png"
            alt="Foodfolio Logo"
            className="logo"
          />
        </Link>

        <div className="nav-buttons">

          {isLoggedIn ? (
            <button className="button primary" onClick={() => auth.logout()}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          ) : (
            <Link to="/login" className="button primary">
              <i className="bi bi-person"></i> Login
              </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
