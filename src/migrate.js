const { STANDARD, SUBJECT } = require("./utils/constants");
const prisma = require('./prisma');
const bcrypt = require('bcrypt');

(async () => {

    const salt = await bcrypt.genSalt();

    const adminData = {
        name: {
            firstName: 'Admin',
            lastName: 'One'
        },
        email: 'admin@something.com',
        password: await bcrypt.hash('helloworld', salt),
        phoneNo: '1234567890'
    };

    const studentData = {
        name: {
            firstName: 'Student',
            lastName: 'One'
        },
        email: 'student@one.com',
        password: await bcrypt.hash('helloworld', salt),
        std: STANDARD[10],
        phoneNo: '1234567890',
        enrolNo: 133
    };

    const testsData = [
        {
            date: new Date(),
            std: STANDARD[10],
            subject: SUBJECT[0],
            total: 100
        },
        {
            date: new Date(),
            std: STANDARD[10],
            subject: SUBJECT[1],
            total: 100
        }
    ];

    const admin = await prisma.admin.create({
        data: adminData
    });

    const student = await prisma.student.create({
        data: studentData
    });

    const test1 = await prisma.test.create({
        data: {
            ...testsData[0],
            reviewer: {
                connect: { id: admin.id }
            }
        }
    });

    const test2 = await prisma.test.create({
        data: {
            ...testsData[1],
            reviewer: {
                connect: { id: admin.id }
            }
        }
    });

    await prisma.result.createMany({
        data: [
            {
                marks: 50,
                studentId: student.id,
                testId: test1.id
            },
            {
                marks: 50,
                studentId: student.id,
                testId: test2.id
            }
        ]
    });

    // const result1 = await prisma.result.create({
    //     data: {
    //         student: { connect: student.id },
    //         test: { connect: test1.id }
    //     }
    // });

    // const result2 = await prisma.result.create({

    // });
})();