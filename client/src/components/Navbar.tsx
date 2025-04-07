// client/src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  // State to track the login status
  const [loginCheck, setLoginCheck] = useState(false);

  // Function to check if the user is logged in
  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  // useEffect hook to run checkLogin() on component mount and when loginCheck state changes
  useEffect(() => {
    checkLogin();
  }, [loginCheck]);

  return (
    <nav className="display-flex justify-space-between align-center py-2 px-5 mint-green">
      <div>
        <h1>
          <Link to="/">Foodfolio</Link>
        </h1>
      </div>

      <div>
        {loginCheck && (
          <>
            <Link to="/recipes" className="btn mr-2">Browse Recipes</Link>
            {/* Add more navigation links as needed */}
          </>
        )}

        {!loginCheck ? (
          <button className="btn" type='button'>
            <Link to='/login'>Login</Link>
          </button>
        ) : (
          <button className="btn" type='button' onClick={() => {
            auth.logout();
          }}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;