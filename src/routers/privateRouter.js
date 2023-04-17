const { Router } = require('express');
const firewall = require('./firewall');

const router = Router();

router.get('/dashboard', firewall, (req, res) => {
    console.log('Hit');
    res.send();
});

router.get('/result/add', firewall, (req, res) => {
    console.log('Hit');
    res.send();
});

router.get('/result/update', firewall, (req, res) => {
    console.log('Hit');
    res.send();
});

router.get('/result/delete', firewall, (req, res) => {
    console.log('Hit');
    res.send();
});

module.exports = router;