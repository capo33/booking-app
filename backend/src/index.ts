import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import userRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';
import myHotelsRoutes from './routes/my-hotels.routes';

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Database
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log('Connecting to MongoDB: success');
  })
  .catch((error) => {
    console.error('Connecting to MongoDB: error');
    console.error(error.message);
  });

// App
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Make uploads folder static
 app.use(express.static(path.join(__dirname, '../../frontend/dist')));
 
  // for any route that is not api, redirect to index.html
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/my-hotels', myHotelsRoutes);

// Server
app.listen(7000, () => {
  console.log('listening on http://localhost:7000');
});
