import mongoose, { model } from "mongoose";
import { MONGODB_URI } from "./config";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'Brainly', // Explicitly specify the database name
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected successfully to database: Brainly');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model("User", userSchema);

const contentSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: ['youtube', 'twitter', 'document'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const ContentModel = mongoose.model("Content", contentSchema);

const linkSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    hash: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

export const LinkModel = mongoose.model("Links", linkSchema);
