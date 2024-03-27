import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';

// Database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Server
app.listen(7000, () => {
  console.log('listening on http://localhost:7000');
});
