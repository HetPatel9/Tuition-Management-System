const { Router } = require('express');
const firewall = require('./firewall');
const prisma = require('../prisma');
const { PAGE_NOT_FOUND } = require('../utils/paths');
const { STANDARD, SUBJECT, STATUS } = require('../utils/constants');

const router = Router();

router.get('/results', firewall, async (req, res) => {
    const {
        enrol,
        sub,
        std,
    } = req.query;
    const query = { where: {} };

    if (enrol) query.where.enrolNo = parseInt(enrol);
    if (sub) {
        query.where.test = { subject: SUBJECT[sub] };
    }
    if (std) {
        if (query.where.test) query.where.test.std = STANDARD[std];
        else query.where.test = { std: STANDARD[std] };
    }

    const results = await prisma.result.findMany(query);

    res.send({ message: 'Success', data: results });
});

router.get('/student/results', firewall, async (req, res) => {
    if (req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    const student = await prisma.student.findUnique({
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

    const resultsBySubject = {};

    student.results.forEach(result => {
        const temp = {
            date: result.test.date,
            total: result.test.total,
            status: result.status
        };
        result.status === STATUS[1] && (temp.marks = result.marks);

        resultsBySubject[result.test.subject]?.push(temp) ?? (resultsBySubject[result.test.subject] = [temp]);
    });

    res.send({
        message: 'Success', data: {
            name: student.name,
            results: resultsBySubject
        }
    });
});

router.post('/test', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    let {
        date,
        std,
        subject
    } = req.body;

    const test = await prisma.test.findFirst({
        where: {
            date,
            std: STANDARD[std],
            subject: SUBJECT[subject]
        }
    });

    res.send({
        message: 'Success',
        data: {
            id: test.id,
            std,
            subject
        }
    });
});

router.post('/test/add', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    let {
        date,
        std,
        subject,
        total
    } = req.body;

    const test = await prisma.test.create({
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

    res.send({
        message: 'Success',
        data: {
            id: test.id,
            std,
            subject
        }
    });
});


router.delete('/test/delete', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    let {
        date,
        std,
        subject
    } = req.body;

    await prisma.test.delete({
        where: {
            test_unique_key: {
                date,
                std: STANDARD[std],
                subject: SUBJECT[subject]
            }
        }
    });

    res.send({ message: 'Success' });
});

router.post('/results/add', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    const { test: { id, std }, results } = req.body;

    const allStudents = await prisma.student.findMany({
        where: { std: STANDARD[std] }, select: { enrolNo: true },
    });

    const data = allStudents.map(student => {
        const temp = {
            testId: id,
            enrolNo: student.enrolNo
        };

        results[student.enrolNo] ?
            (temp.marks = parseFloat(results[student.enrolNo])) :
            (temp.status = STATUS[0]);
        return temp;
    });

    await prisma.result.createMany({ data });

    res.send({ message: 'Success' });
});

router.put('/results/update', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    const { test: { id }, results } = req.body;

    const updateQuery = results.map(result => prisma.result.update({
        where: {
            result_unique_key: {
                enrolNo: result.enrolNo,
                testId: id
            }
        },
        data: {
            marks: result.obtained ?? -1,
            status: STATUS[result.status]
        }
    }));

    await prisma.$transaction(updateQuery);
    res.send({ message: 'Success' });
});

router.delete('/results/delete', firewall, async (req, res) => {
    if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

    const { test: { id }, students } = req.body;

    await prisma.result.deleteMany({
        where: {
            OR: students.map(student => ({
                enrolNo: student
            })),
            testId: id
        }
    });

    res.send({ message: 'Success' });
});

module.exports = router;