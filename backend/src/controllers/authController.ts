import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}


export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};


export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    console.log("Login attempt:", username);
    
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });


    res.json({ token, username: user.username });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

