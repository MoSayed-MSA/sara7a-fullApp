import express from 'express';
import connectDB from "./lib/db/mongoose.js";
import cors from 'cors';
import multer from 'multer';

import router from './routes.js';
import globalErrorHandler from './lib/error/globalErrorHandeler.js';
import { CorrelationId } from './lib/correlation/correlationId.js';
import cookieParser from 'cookie-parser';


export function createApp() {
    const app = express();
    app.use(cors());
    app.use(cookieParser());

    // connect to DB
    connectDB();
    app.use(express.json());


    app.use(CorrelationId);
    // routes
    app.use('/api', router);

    // global error handler
    app.use(globalErrorHandler);

    return app;
}