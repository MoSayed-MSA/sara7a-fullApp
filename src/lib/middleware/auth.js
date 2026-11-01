import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.js";
import { verifyToken } from "../security/jwt.js";

export function authenticate(req, res, next) {
    const token = req.cookies?.access_token

    if (!token) {
        return next(new AppError("Unauthorized: Token missing", 401));
    }

    try {
        const decoded = verifyToken(token)
        req.user = decoded; // { userId, email }
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401));
    }
}