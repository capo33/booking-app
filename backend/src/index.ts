import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';
import path from 'path';

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
if (process.env.NODE_ENV === "production") {
  const __dirname: string = path.resolve();
   app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  // for any route that is not api, redirect to index.html
  app.get("*", (req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"))
  );
} else {
  // Welcome route
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "API is running...",
    });
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Server
app.listen(7000, () => {
  console.log('listening on http://localhost:7000');
});
