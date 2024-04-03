import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { User } from '../models/user';
import verifyToken from '../middlewares/auth';

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

      res.cookie(process.env.AUTH_TOKEN as string, token, {
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

// const registerValidation = [
//   check('email', 'email is required').isEmail(),
//   check(
//     'password',
//     'password with 6 or more characters is required'
//   ).isLength({ min: 6 }),
// ];

router.get('/validate-token', verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie(process.env.AUTH_TOKEN as string, {
    expires: new Date(0),
  });
  res.status(200).json({ message: 'signed out successfully' });
});

export default router;
