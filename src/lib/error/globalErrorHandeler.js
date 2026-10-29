import { logger } from '../../pkg/logger/logger.js';
import dotenv from 'dotenv';

// global error handler
export const globalErrorHandler = (err, req, res, _next) => {
    logger.error(err.message, {
        stack: err.stack,
        correlationId: req.correlationId,
    });
    if (err.isOperational === true) {
        return res.status(err.statusCode || 400).json({
            status: "error",
            message: err.message
        });
    }
    return res.status(500).json({
        status: "error",
        message: `Something went wrong on our end`,
    });
};

export default globalErrorHandler;