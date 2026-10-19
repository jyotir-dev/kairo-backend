// Errors
const ApiError = require('../errors/api.error');
const { BadRequestError } = require('../errors/http.errors');

// Validate Middleware
module.exports = (validator) => {
    return (req, res, next) => {
        try {
            validator({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        } catch (error) {
            next(error instanceof ApiError ? error : new BadRequestError('Invalid request data.'));
        }
    };
};