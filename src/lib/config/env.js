
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000'),

    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.string().default('6379'),
    REDIS_PASSWORD: z.string().optional(),

    EMAIL_USER: z.string().email().toLowerCase(),
    EMAIL_PASS: z.string(),

    DATABASE_URL: z.string(),

    JWT_SECRET: z.string(),
    CLIENT_ID: z.string()
});

const parsed = envSchema.parse(process.env);


export const env = {
    port: Number(parsed.PORT),
    redis: {
        host: parsed.REDIS_HOST,
        port: parsed.REDIS_PORT,
        password: parsed.REDIS_PASSWORD
    },
    google: {
        webClientId: parsed.CLIENT_ID,
    },
    nodemailer: {
        user: parsed.EMAIL_USER,
        pass: parsed.EMAIL_PASS
    },
    databaseUrl: parsed.DATABASE_URL,
    jwtSecret: parsed.JWT_SECRET
}