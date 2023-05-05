const { CustomError } = require('../utils/customError');

module.exports = (err, req, res, next) => {
    if (err) {
        if (!(err instanceof CustomError)) err = new CustomError();
        // res.cookie('auth-token', '', { maxAge: 0, httpOnly: true });
        return res.status(err.code).send({
            message: err.message,
            description: err.description
        });
    }
};