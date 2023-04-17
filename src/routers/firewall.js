const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const prisma = require('../prisma');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
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
            return res.status(401).send({ message: 'Unauthorized' });
    }

    req.user = user;
    req.token = token;
    next();
};