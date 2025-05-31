import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel, LinkModel } from "./db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { JWT_PASSWORD, PORT } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";
import { jwtDecode } from "jwt-decode";
import multer from "multer";
import path from "path";
import fs from "fs";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';

const app = express();

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    const signupSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        email: z.string().email("Invalid email address")
    });

    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: result.error.errors,
        });
    }

    const { username, password, email } = result.data;

    try {
        const existingUser = await UserModel.findOne({ 
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            password: hashedPassword,
            email
        });

        const token = jwt.sign({ id: user._id }, JWT_PASSWORD);

        return res.status(201).json({
            message: "User signed up successfully",
            token
        });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Username or email already exists" });
        }
        console.error("Signup Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await UserModel.findOne({ username }).exec();

    if (!existingUser || !existingUser.password) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);

    return res.json({ token });

  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const linkContentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    link: z.string().url("Invalid URL"),
    type: z.enum(["youtube", "twitter"]),
});

const documentContentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.literal("document"),
});

app.get("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const content = await ContentModel.find({
            userId: userId
        }).populate("userId", "username");
        
        res.json({ content });
    } catch (err) {
        console.error("Error fetching content:", err);
        res.status(500).json({ message: "Failed to fetch content" });
    }
});

app.post('/api/v1/content', userMiddleware, upload.single('file'), async (req, res) => {
    const userId = (req as any).userId;
    const { title, type } = req.body;
    const file = req.file;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        let newContent;

        if (type === 'document') {
            const validation = documentContentSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: validation.error.errors });
            }
            if (!file) {
                return res.status(400).json({ message: "File is required for document content" });
            }
            const link = `/uploads/${file.filename}`;

            newContent = new ContentModel({
                userId: userId,
                title: validation.data.title,
                link: link,
                type: 'document',
            });
        } else if (type === 'youtube' || type === 'twitter') {
            const validation = linkContentSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: validation.error.errors });
            }
            newContent = new ContentModel({
                userId: userId,
                title: validation.data.title,
                link: validation.data.link,
                type: validation.data.type,
            });
        } else {
            return res.status(400).json({ message: "Invalid content type provided." });
        }

        await newContent.save();
        res.status(201).json({ message: "Content added successfully", content: newContent });
    } catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ message: "Failed to add content" });
    }
});

app.delete("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const deleteSchema = z.object({
        contentId: z.string().min(1, "Content ID is required")
    });

    const result = deleteSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: result.error.errors,
        });
    }

    const { contentId } = result.data;

    try {
        const content = await ContentModel.findOne({
            _id: contentId,
            userId: req.userId
        });

        if (!content) {
            return res.status(404).json({ message: "Content not found or not authorized" });
        }

        // If it's a document, delete the file first
        if (content.type === 'document') {
            const filePath = path.join(__dirname, content.link);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const result = await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Content not found or not authorized" });
        }

        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error("Error deleting content:", error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: "Invalid content ID format" });
        }
        res.status(500).json({ message: "Failed to delete content" });
    }
});

app.get("/api/v1/brain/share", userMiddleware, async (req: Request, res: Response) => {
    try {
        const link = await LinkModel.findOne({
            userId: req.userId
        });

        if (link) {
            return res.json({ hash: link.hash });
        } else {
            return res.json({ hash: null });
        }
    } catch (err) {
        console.error("Error checking share status:", err);
        return res.status(500).json({ message: "Failed to check share status" });
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req: Request, res: Response) => {
    try {
        const shareSchema = z.object({
            share: z.boolean()
        });

        const result = shareSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: result.error.errors,
            });
        }

        const { share } = result.data;

        if (share) {
            const existingLink = await LinkModel.findOne({
                userId: req.userId
            });

            if (existingLink) {
                return res.json({
                    hash: existingLink.hash,
                    message: "Share link already exists"
                });
            }

            const hash = random(10);
            const newLink = await LinkModel.create({
                userId: req.userId,
                hash: hash
            });

            return res.json({
                hash: newLink.hash,
                message: "Share link created successfully"
            });
        } else {
            await LinkModel.deleteOne({
                userId: req.userId
            });

            return res.json({
                hash: null,
                message: "Share link removed successfully"
            });
        }
    } catch (err) {
        console.error("Error handling share:", err);
        return res.status(500).json({ message: "Failed to handle share request" });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })
});

app.get("/api/v1/content/search", userMiddleware, async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string;
        
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }
        
        const searchPattern = new RegExp(searchTerm, 'i');
        
        const searchResults = await ContentModel.find({
            userId: req.userId,
            $or: [
                { title: { $regex: searchPattern } },
                { type: { $regex: searchPattern } }
            ]
        });
        
        return res.json({ results: searchResults });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({ message: "Error performing search" });
    }
});

app.get("/api/v1/profile", userMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
});

app.put("/api/v1/profile", userMiddleware, async (req: Request, res: Response) => {
    const profileSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long")
    });

    const result = profileSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: result.error.errors,
        });
    }

    const { username } = result.data;

    try {
        // Check if username is already taken by another user
        const existingUser = await UserModel.findOne({ 
            username, 
            _id: { $ne: req.userId } 
        });
        
        if (existingUser) {
            return res.status(409).json({ message: "Username already taken" });
        }

        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            { username },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("MongoDB connection state:", mongoose.connection.readyState);
});
