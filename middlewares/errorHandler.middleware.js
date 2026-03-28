const { logger } = require('../utilities/logger.utility');

module.exports = (err, req, res, next) => {
    // Default values
    let error = Object.assign(err); 
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'Error';
    error.message = err.message;

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(el => el.message);
        error.message = `Invalid input: ${messages.join('. ')}`;
        error.statusCode = 400;
    }

    //  Duplicate: Email already exists
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // Get the specific field name
        error.message = `That ${field} is already registered.`;
        error.statusCode = 400;
    }

    logger.error(`${error.status} : ${error.statusCode} | [${req.method} - ${req.originalUrl}] : ${error.message}`, {
        stack: error.stack,
        user: req.user?._id,
        statusCode: error.statusCode
    });

    if (process.env.NODE_ENV === 'development') {
        return res.status(error.statusCode).json({
            status: error.status,
            error: error,
            message: error.message,
            stack: error.stack
        });
    }
    
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
};
