import { ApError } from "../../pkg/error/error.js";
import { verifyToken } from "../security/jwt.js";

export function guard(req, res, next) {
    try {
        const token = req.cookies?.access_token;
        if (!token) {
            throw new ApError("No token provided", 401);
        }
        const payload = verifyToken(token);
        req.user = payload;

        next()

    } catch (error) {
        next(error);
    }

}
