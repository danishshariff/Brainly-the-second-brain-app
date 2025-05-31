import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Brainly';
export const JWT_PASSWORD = process.env.JWT_PASSWORD || 'your-secret-key';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';