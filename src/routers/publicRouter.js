const { Router } = require('express');
const { LANDING_PAGE, LOGIN_PAGE, SIGNUP_PAGE } = require('../utils/paths');

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(LANDING_PAGE);
});

router.get('/login', (req, res) => {
    res.sendFile(LOGIN_PAGE);
});

router.get('/signup', (req, res) => {
    res.sendFile(SIGNUP_PAGE);
});

module.exports = router;