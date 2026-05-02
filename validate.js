const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (err) {
        if (err.name === 'ZodError') {
            const errArray = err.issues || err.errors;
            if (Array.isArray(errArray)) {
                const message = errArray.map(e => e.message).join(', ');
                return next(new AppError(message, 400));
            }
            return next(new AppError('Validation Error', 400));
        }
        next(err);
    }
};

module.exports = validate;
