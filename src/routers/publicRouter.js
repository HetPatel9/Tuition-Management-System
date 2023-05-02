const { Router } = require('express');
const { LANDING_PAGE, LOGIN_PAGE, SIGNUP_PAGE } = require('../utils/paths');

const router = Router();

const redirectionMiddleware = (req, res, next) => {
    if (req.cookies['auth-token']) return res.redirect(302, '/dashboard');
    next();
};

router.get('/', redirectionMiddleware, (req, res) => {
    res.sendFile(LANDING_PAGE);
});

router.get('/login', redirectionMiddleware, (req, res) => {
    res.sendFile(LOGIN_PAGE);
});

router.get('/signup', redirectionMiddleware, (req, res) => {
    res.sendFile(SIGNUP_PAGE);
});

module.exports = router;