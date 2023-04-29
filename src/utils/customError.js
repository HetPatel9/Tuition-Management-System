const { STATUS_CODES } = require('http');

const ERRORS = {
    'CERR_41': {
        httpStatusCode: 401,
        message: 'Unauthorized',
        description: 'User is required to be authenticated before accessing this Endpoint'
    },
    'CERR_42': {
        httpStatusCode: 401,
        message: 'Unauthenticated',
        description: 'User authentication failed due to Invalid Credentials'
    },
    'CERR_43': (keyword, identifier) => {
        return {
            httpStatusCode: 401,
            message: 'Unauthenticated',
            description: `User authentication failure due to non-existence of ${keyword} - '${identifier}'`
        };
    },
    'CERR_44': (keyword, value) => {
        return {
            httpStatusCode: 409,
            message: 'Conflict',
            description: `A user with ${keyword} '${value}' already exists`
        };
    },
    'CERR_45': (keyword) => {
        return {
            httpStatusCode: 404,
            message: 'Not Found',
            description: `${keyword} not found`
        };
    },
    'CERR_46': {
        httpStatusCode: 400,
        message: 'Bad Request',
        description: 'Invalid Request body'
    },
    'CERR_47': {
        httpStatusCode: 400,
        message: 'Bad Request',
        description: 'Invalid Request Parameters'
    },
    'CERR_48': {
        httpStatusCode: 400,
        message: 'Bad Request',
        description: 'Invalid Query Parameters'
    },
    'CERR_51': {
        httpStatusCode: 500,
        message: 'Internal Server Error',
        description: 'Something went wrong on the Server side'
    }
};

class CustomError extends Error {
    constructor({ message, httpStatusCode, description } = ERRORS['CERR_51']) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = this.getValidStatusCode(httpStatusCode);
        this.description = description;
    }

    getValidStatusCode(code) {
        return STATUS_CODES[code] ? code : 500;
    }
}

module.exports = {
    CustomError,
    ERRORS
};