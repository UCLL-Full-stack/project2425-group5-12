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

    const johndoe = await prisma.user.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@ucll.be',
            password: await bcrypt.hash('john123', 12),
            role: 'USER',
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

    const highpriority = await prisma.tag.create({ data: { title: 'high-priority' } });

    const lab2 = await prisma.task.create({
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
        },
    });

    await prisma.project.create({
        data: {
            title: 'Full-Stack',
            description: 'Full-Stack Course',
            done: false,
            owner: {
                connect: { id: johndoe.id },
            },
            members: { connect: [{ id: johndoe.id }, { id: janetoe.id }] },
            tasks: { connect: [{ id: lab2.id }] },
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
