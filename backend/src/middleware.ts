import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers["authorization"];
        if (!header) {
            return res.status(403).json({
                message: "No authorization header"
            });
        }

        // Handle both Bearer token and raw token
        const token = header.startsWith("Bearer ") ? header.substring(7) : header;
        
        const decoded = jwt.verify(token, JWT_PASSWORD);
        if (!decoded || typeof decoded === "string") {
            return res.status(403).json({
                message: "Invalid token"
            });
        }

        req.userId = (decoded as JwtPayload).id;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}