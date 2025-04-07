import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

// login function to authenticate a user
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("Login attempt for:", username);

  try {
    // find the user in the database by username
    const user = await User.findOne({
      where: { username },
    });

    console.log("User found:", user ? "Yes" : "No");

    // if user is not found, send an authentication failed response
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed - user not found' });
    }

    // compare the provided password with the stored hashed password
    console.log("Comparing passwords...");
    const passwordIsValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", passwordIsValid);

    // if password is invalid, send an authentication failed response
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Authentication failed - invalid password' });
    }

    // get the secret key from environment variables
    const secretKey = process.env.JWT_SECRET_KEY || '';

    // generate a JWT token for the authenticated user
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

// registration function to create a new user
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log("Registration attempt for:", username);

  try {
    // check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    // create new user
    const newUser = await User.create({
      username,
      email,
      password // password will be hashed by the user model hooks
    });

    // generate token using the newly created user data
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const token = jwt.sign({ username: newUser.username }, secretKey, { expiresIn: '1h' });

    return res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// create a new router instance
const router = Router();

// post login - login a user
router.post('/login', login);

// post register - register a new user
router.post('/register', register);

export default router;