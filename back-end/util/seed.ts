import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "Task" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Project" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Tag" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;

    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.task.deleteMany();

    const johndoe = await prisma.user.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@ucll.be',
            password: await bcrypt.hash('john123', 12),
            role: 'ADMIN',
        },
    });

    await prisma.project.create({
        data: {
            title: 'TO DO',
            description: 'Your default to do list.',
            done: false,
            owner: {
                connect: { id: johndoe.id },
            },
            members: { connect: [{ id: johndoe.id }] },
            tasks: {},
        },
    });

    const janetoe = await prisma.user.create({
        data: {
            firstName: 'Jane',
            lastName: 'Toe',
            email: 'jane.toe@ucll.be',
            password: await bcrypt.hash('jane123', 12),
            role: 'USER',
        },
    });

    await prisma.project.create({
        data: {
            title: 'TO DO',
            description: 'Your default to do list.',
            done: false,
            owner: {
                connect: { id: janetoe.id },
            },
            members: { connect: [{ id: janetoe.id }] },
            tasks: {},
        },
    });

    const jackmoe = await prisma.user.create({
        data: {
            firstName: 'Jack',
            lastName: 'Moe',
            email: 'jack.moe@ucll.be',
            password: await bcrypt.hash('jack123', 12),
            role: 'PROJECT_MANAGER',
        },
    });

    await prisma.project.create({
        data: {
            title: 'TO DO',
            description: 'Your default to do list.',
            done: false,
            owner: {
                connect: { id: jackmoe.id },
            },
            members: { connect: [{ id: jackmoe.id }] },
            tasks: {},
        },
    });

    const highpriority = await prisma.tag.create({ data: { title: 'high-priority' } });

    const fullstack = await prisma.project.create({
        data: {
            title: 'Full-Stack',
            description: 'Full-Stack Course',
            done: false,
            owner: {
                connect: { id: johndoe.id },
            },
            members: { connect: [{ id: johndoe.id }, { id: janetoe.id }] },
            tasks: {},
        },
    });

    await prisma.project.create({
        data: {
            title: 'Daml',
            description: 'Data analytics and machine learning',
            done: false,
            owner: {
                connect: { id: jackmoe.id },
            },
            members: { connect: [{ id: jackmoe.id }] },
            tasks: {},
        },
    });

    await prisma.task.create({
        data: {
            title: 'Finish lab2',
            description: 'nodejs and express assignment',
            done: false,
            deadline: set(new Date(), { year: 2025, month: 10, date: 28, hours: 15 }),
            owner: { connect: { id: johndoe.id } },
            tags: {
                connect: [
                    {
                        id: highpriority.id,
                    },
                ],
            },
            project: { connect: { id: fullstack.id } },
        },
    });
};

main()
    .catch((error) => {
        console.error('Error during seeding: ', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
