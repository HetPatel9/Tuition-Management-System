const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const firewall = require('./firewall');
const prisma = require('../prisma');
const { STANDARD, JWT_SECRET, ADMIN_REFERENCE_KEY } = require('../utils/constants');

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user = null;

    user = await prisma.student.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.admin.findUnique({ where: { email } });
        if (!user)
            return res.status(400).send({ message: 'User not found' });

        user.isAdmin = true;
    }

    if (!user) {
        return res.status(400).send({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(400).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    await prisma[user.isAdmin ? 'admin' : 'student'].update({
        where: {
            id: user.id
        },
        data: {
            tokens: {
                push: token
            }
        }
    });

    res.cookie('auth-token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000)
    });
    res.send({ message: 'Success', token });
});

router.post('/signup', async (req, res) => {
    console.log(req.body);
    let {
        firstName,
        lastName,
        email,
        password,
        std,
        phoneNo,
        enrolNo
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const student = await prisma.student.create({
        data: {
            name: {
                firstName,
                lastName
            },
            email,
            password,
            phoneNo,
            enrolNo: parseInt(enrolNo),
            std: STANDARD[std]
        }
    });

    const token = jwt.sign({ id: student.id }, JWT_SECRET, {
        expiresIn: 3600
    });

    await prisma.student.update({
        where: {
            id: student.id
        },
        data: {
            tokens: {
                push: token
            }
        }
    });

    res.cookie('auth-token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000)
    });
    res.redirect(301, '/dashboard');
});

router.post('/register-admin', async (req, res) => {
    let {
        refKey,
        firstName,
        lastName,
        email,
        password
    } = req.body;

    if (!refKey || refKey !== ADMIN_REFERENCE_KEY) return res.status(400).send({ message: 'Invalid data' });
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const admin = await prisma.admin.create({
        data: {
            name: { firstName, lastName },
            email,
            password
        }
    });

    const token = jwt.sign({ id: admin.id }, JWT_SECRET);

    await prisma.admin.update({
        where: { id: admin.id },
        data: { tokens: { push: token } }
    });

    res.cookie('auth-token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000)
    });
    res.send({ message: 'Success' });
});

router.post('/signout', firewall, async (req, res) => {
    await prisma[req.user.isAdmin ? 'admin' : 'student'].update({
        where: { id: req.user.id },
        data: {
            tokens: req.user.tokens.filter(token => token !== req.token)
        }
    });

    res.cookie('auth-token', '');
    res.send({ message: 'Success' });
});

module.exports = router;