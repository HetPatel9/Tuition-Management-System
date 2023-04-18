const { Router } = require('express');
const firewall = require('./firewall');
const prisma = require('../prisma');
const { PAGE_NOT_FOUND } = require('../utils/paths');
const { STANDARD, SUBJECT } = require('../utils/constants');
const { Subject } = require('@prisma/client');

const router = Router();

router.get('/results', firewall, async (req, res) => {
    const {
        s_id = req.user.id,
        t_id,
        sub,
        std = req.user.std
    } = req.query;

    // await prisma.test.findFirst();

});

router.get('/student/results', firewall, async (req, res) => {
    if (req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    const { results } = await prisma.student.findUnique({
        where: { id: req.user.id }, include: {
            results: {
                include: {
                    test: {
                        select: {
                            date: true,
                            total: true,
                            subject: true
                        }
                    }
                }
            }
        }
    });

    const output = {};

    results.forEach(result => {
        if (output[result.test.subject]) output[result.test.subject].push(result);
        else output[result.test.subject] = [result];
    });

    console.log(JSON.stringify(output));

    res.send({ message: 'Success', data: results });
});

router.post('/test/add', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    let {
        date,
        std,
        subject,
        total
    } = req.body;

    await prisma.test.create({
        data: {
            date,
            std: STANDARD[std],
            subject: SUBJECT[subject],
            total: parseInt(total),
            reviewer: {
                connect: { id: req.user.id }
            }
        }
    });

    res.send({ message: 'Success' });
});

router.post('/results/add', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

});

router.put('/results/update', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);
});

router.delete('/results/delete', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);
});

module.exports = router;