const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error
    if (err.statusCode >= 500) {
        logger.error('SERVER ERROR:', err);
    } else {
        logger.warn('OPERATIONAL ERROR:', { message: err.message, stack: err.stack });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        err = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        err = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid token. Please log in again.', 401);
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.message || 'Server Error'
    });
};

module.exports = errorHandler;
