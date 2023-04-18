const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const prisma = require('../prisma');

module.exports = async function (req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) {
        return res.redirect(301, '/login');
    }

    const { id } = jwt.verify(token, JWT_SECRET);

    let user = null;

    user = await prisma.student.findFirst({
        where: { id, tokens: { has: token } }
    });
    if (!user) {
        user = await prisma.admin.findFirst({
            where: { id, tokens: { has: token } }
        });
        if (user)
            user.isAdmin = true;
        else
            return res.redirect(301, '/login');
    }

    req.user = user;
    req.token = token;
    next();
};