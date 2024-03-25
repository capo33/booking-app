import JWT from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/register',
  [
    check('firstName', 'firstName is required').isString(),
    check('lastName', 'lastName is required').isString(),
    check('email', 'email is required').isEmail(),
    check('password', 'password with 6 or more characters is required').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()
      });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({
          message: 'User already exists',
        });
      }
      user = new User(req.body);
      await user.save();

      const token = JWT.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1d' }
      );

      res.cookie('auth.token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
      });

      // we don't need to send anything in the body because we are sending http cookies
      return res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
