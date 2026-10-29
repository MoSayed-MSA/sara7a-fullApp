export class ApError extends Error {
    statusCode;
    isOperational;

    constructor(message, statusCode, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        Error.captureStackTrace(this, this.constructor);
    }
}