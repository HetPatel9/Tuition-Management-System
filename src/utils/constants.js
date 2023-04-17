const { Standard } = require('@prisma/client');

const PORT = process.env.PORT;
const ADMIN_REFERENCE_KEY = process.env.ADMIN_REFERENCE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

const STANDARD = {
    8: Standard.EIGHT,
    9: Standard.NINE,
    10: Standard.TEN
};

module.exports = {
    PORT,
    ADMIN_REFERENCE_KEY,
    JWT_SECRET,
    STANDARD
};