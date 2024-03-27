import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/login',
  [
    check('email', 'email is required').isEmail(),
    check(
      'password',
      'password with 6 or more characters is required'
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        message: error.array(),
      });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email });
      console.log(user);

      if (!user) {
        return res.status(400).json({
          message: 'Invalid credentials',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Invalid credentials',
        });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1d' }
      );

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'something went wrong',
      });
    }
  }
);

export default router;
