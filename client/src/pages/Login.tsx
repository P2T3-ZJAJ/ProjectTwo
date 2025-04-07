import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from '../utils/auth';
import { login } from "../api/authAPI";
import { UserLogin } from "../interfaces/UserLogin";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // check if already logged in
  useEffect(() => {
    if (Auth.loggedIn()) {
      navigate('/recipes');
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", loginData);
      const response = await login(loginData);
      console.log("Login response:", response);

      if (response && response.token) {
        console.log("Login successful, token received");
        Auth.login(response.token);
        navigate("/recipes");
      } else {
        console.error("Login failed: No token in response", response);
        setError("Login failed. Please check your credentials.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      // type guard to safely access the message property if it exists
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please check your credentials.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <form className='form login-form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            className="form-input"
            type='text'
            name='username'
            placeholder='Enter your username'
            value={loginData.username || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            className="form-input"
            type='password'
            name='password'
            placeholder='Enter your password'
            value={loginData.password || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <button 
            className="btn btn-primary" 
            type='submit'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        <div className="mt-3">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;