const errorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = error.message

    // mongoose cast error
    if (error.name === 'castError') {
        const message = `Invalid path`;
        error = errorResponse(message, 404)
    }

    // duplicate key error
    if (error.code === 11000) {
        const message = `Duplicate key entered`;
        error = errorResponse(message, 400)
    }

    // mongoose validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map(val => val.message);
        error = errorResponse(message, 400)
    }
}

module.exports=errorHandler