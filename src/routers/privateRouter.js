const { Router } = require('express');
const firewall = require('./firewall');
const {
    ADMIN_DASHBOARD,
    STUDENT_DASHBOARD,
    ADMIN_ADD_RESULT_PAGE,
    ADMIN_UPDATE_RESULT_PAGE,
    ADMIN_DELETE_RESULT_PAGE,
    PAGE_NOT_FOUND
} = require('../utils/paths');

const router = Router();

router.get('/dashboard', firewall, (req, res) => {
    res.sendFile(req.user.isAdmin ? ADMIN_DASHBOARD : STUDENT_DASHBOARD);
});

router.get('/add', firewall, (req, res) => {
    res.sendFile(req.user.isAdmin ? ADMIN_ADD_RESULT_PAGE : PAGE_NOT_FOUND);
});

router.get('/update', firewall, (req, res) => {
    res.sendFile(req.user.isAdmin ? ADMIN_UPDATE_RESULT_PAGE : PAGE_NOT_FOUND);
});

router.get('/delete', firewall, (req, res) => {
    res.sendFile(req.user.isAdmin ? ADMIN_DELETE_RESULT_PAGE : PAGE_NOT_FOUND);
});

module.exports = router;