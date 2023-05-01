const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const firewall = require('./firewall');
const prisma = require('../prisma');
const { STANDARD, JWT_SECRET, ADMIN_REFERENCE_KEY } = require('../utils/constants');
const { CustomError, ERRORS } = require('../utils/customError');

const router = Router();

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let user = null;

        user = await prisma.student.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.admin.findUnique({ where: { email } });
            if (!user)
                return next(new CustomError(ERRORS['CERR_43']('email', email)));

            user.isAdmin = true;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return next(new CustomError(ERRORS['CERR_42']));
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        await prisma[user.isAdmin ? 'admin' : 'student'].update({
            where: { id: user.id },
            data: { tokens: { push: token } }
        });

        res.cookie('auth-token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000)
        });
        return res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

router.post('/register', async (req, res, next) => {
    try {
        let {
            fname: firstName,
            lname: lastName,
            email,
            password,
            std,
            phNo: phoneNo,
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
        return res.redirect(301, '/dashboard');
    } catch (err) {
        console.error(err);
        if (err.code === 'P2002') {
            return next(new CustomError(err.meta.target.includes('email') ?
                ERRORS['CERR_44']('email', req.body.email) :
                ERRORS['CERR_44']('enrolNo', req.body.enrolNo)
            ));
        }
        next(new CustomError());
    }
});

router.post('/register-admin', async (req, res, next) => {
    try {


        let {
            refKey,
            firstName,
            lastName,
            email,
            password,
            phoneNo
        } = req.body;

        if (!refKey || refKey !== ADMIN_REFERENCE_KEY) return next(new CustomError(ERRORS['CERR_42']));

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        const admin = await prisma.admin.create({
            data: {
                name: { firstName, lastName },
                email,
                password,
                phoneNo
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
        return res.redirect(301, '/dashboard');
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

router.post('/logout', firewall, async (req, res, next) => {
    try {
        await prisma[req.user.isAdmin ? 'admin' : 'student'].update({
            where: { id: req.user.id },
            data: {
                tokens: req.user.tokens.filter(token => token !== req.token)
            }
        });

        res.cookie('auth-token', '');
        return res.redirect(301, '/');
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

module.exports = router;