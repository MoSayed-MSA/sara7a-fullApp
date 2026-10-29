import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';

export function generateToken(payload, expTime) {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: expTime })
}

export function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
}