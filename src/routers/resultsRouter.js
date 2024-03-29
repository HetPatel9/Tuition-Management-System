const { Router } = require('express');
const moment = require('moment');
const firewall = require('./firewall');
const prisma = require('../prisma');
const { PAGE_NOT_FOUND } = require('../utils/paths');
const { STANDARD, SUBJECT, STATUS } = require('../utils/constants');
const { CustomError, ERRORS } = require('../utils/customError');

const router = Router();

router.get('/results', firewall, async (req, res, next) => {
    try {
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

        let results = await prisma.result.findMany({
            ...query,
            orderBy: {
                enrolNo: 'asc'
            },
            include: {
                test: {
                    select: {
                        date: true,
                        total: true
                    }
                }
            }
        });

        results = results.map(result => ({
            studentId: result.enrolNo,
            marks: result.marks,
            date: moment(result.test.date).format('DD/MM/YYYY'),
            total: result.test.total,
            status: result.status
        }));

        return res.send({
            message: 'Success', data: {
                user: {
                    firstName: req.user.name.firstName,
                    lastName: req.user.name.lastName
                },
                results
            }
        });
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

router.get('/student/results', firewall, async (req, res, next) => {
    try {

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
                date: moment(result.test.date).format('DD/MM/YYYY'),
                total: result.test.total,
                status: result.status
            };
            result.status === STATUS[1] && (temp.marks = result.marks);

            resultsBySubject[result.test.subject]?.push(temp) ?? (resultsBySubject[result.test.subject] = [temp]);
        });

        return res.send({
            message: 'Success', data: {
                name: student.name,
                results: resultsBySubject
            }
        });
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

router.post('/test', firewall, async (req, res, next) => {
    try {

        if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

        let {
            date,
            std,
            subject
        } = req.body;

        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
            date = new Date(moment(date, 'YYYY-MM-DD').toISOString());
        }

        const test = await prisma.test.findUnique({
            where: {
                'test_unique_key': {
                    date,
                    std: STANDARD[std],
                    subject: SUBJECT[subject]
                }
            }
        });

        return res.send({
            message: 'Success',
            data: {
                id: test.id,
                std,
                subject,
                total: test.total
            }
        });
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

router.post('/test/add', firewall, async (req, res, next) => {
    try {

        if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

        let {
            date,
            std,
            subject,
            total
        } = req.body;

        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
            date = moment(date, 'YYYY-MM-DD').toISOString();
        }

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

        return res.send({
            message: 'Success',
            data: {
                id: test.id,
                std,
                subject,
                total: test.total
            }
        });
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});


router.delete('/test/delete', firewall, async (req, res, next) => {
    try {
        if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

        let {
            date,
            std,
            subject
        } = req.body;

        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
            date = new Date(moment(date, 'YYYY-MM-DD').toISOString());
        }

        await prisma.test.delete({
            where: {
                test_unique_key: {
                    date,
                    std: STANDARD[std],
                    subject: SUBJECT[subject]
                }
            }
        });

        // return res.redirect(302, '/dashboard');
        return res.send({message: 'Success'})
    } catch (err) {
        console.error(err);
        if(err.code === 'P2025') return next(new CustomError(ERRORS.CERR_46))
        next(new CustomError());
    }
});

router.post('/results/add', firewall, async (req, res, next) => {
    try {
        if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

        const { test: { id, std }, results } = req.body;

        const allStudents = await prisma.student.findMany({
            where: { std: STANDARD[std] }, select: { enrolNo: true },
        });

        const data = allStudents.map(student => {
            const temp = {
                testId: id,
                enrolNo: parseInt(student.enrolNo)
            };

            results[student.enrolNo] ?
                (temp.marks = parseFloat(results[student.enrolNo])) :
                (temp.status = STATUS[0]);
            return temp;
        });

        await prisma.result.createMany({ data });

        // return res.redirect(302, '/dashboard');
        return res.send({
            message: 'Success'
        })
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

router.put('/results/update', firewall, async (req, res, next) => {
    console.log(req.body);
    try {
        if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

        const { test: { id }, results } = req.body;

        const updateQuery = results.map(result => prisma.result.update({
            where: {
                result_unique_key: {
                    enrolNo: parseInt(result.enrolNo),
                    testId: id
                }
            },
            data: {
                marks: result.marks ? parseFloat(result.marks) : -1,
                status: STATUS[result.status]
            }
        }));

        await prisma.$transaction(updateQuery);
        // return res.redirect(302, '/dashboard');
        return res.send({
            message: 'Success'
        })
    } catch (err) {
        console.error(err);
        if(err.code === 'P2025') {
            return next(new CustomError(ERRORS.CERR_46))
        }
        next(new CustomError());
    }
});

router.delete('/results/delete', firewall, async (req, res, next) => {
    try {
        if (!req.user.isAdmin) return res.sendFile(PAGE_NOT_FOUND);

        let { test: { date, std, subject }, students } = req.body;

        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
            date = new Date(moment(date, 'YYYY-MM-DD').toISOString());
        }

        const test = await prisma.test.findUnique({
            where: {
                'test_unique_key': {
                    date,
                    std: STANDARD[std],
                    subject: SUBJECT[subject]
                }
            }
        });

        await prisma.result.deleteMany({
            where: {
                OR: students.map(student => ({
                    enrolNo: parseInt(student)
                })),
                testId: test.id
            }
        });

        // return res.redirect(302, '/dashboard');
        return res.send({
            message: 'Success'
        })
    } catch (err) {
        console.error(err);
        next(new CustomError());
    }
});

module.exports = router;