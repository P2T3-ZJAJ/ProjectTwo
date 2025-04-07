import { Router, Request, Response } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { User } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// authentication routes (login/register) - no auth required
router.use('/auth', authRoutes);

// user registration route - no auth required
router.post('/api/users', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // create a new user
    const newUser = await User.create({
      username,
      email,
      password // will be hashed by model hooks
    });

    // return success but don't include the password
    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// all other api routes - auth required
router.use('/api', authenticateToken, apiRoutes);

export default router;