import { set } from 'date-fns';
import { Task } from '../model/task';
import { User } from '../model/user';
import { Tag } from '../model/tag';
import database from './database';

const getAllTasks = async (): Promise<Task[]> => {
    try {
        const tasksPrisma = await database.task.findMany({
            include: { owner: true, tags: true },
        });
        return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const createTask = async (task: Task): Promise<Task> => {
    try {
        const taskPrisma = await database.task.create({
            data: {
                title: task.getTitle(),
                description: task.getDescription(),
                deadline: task.getDeadline(),
                done: task.getDone(),
                owner: {
                    connect: {
                        id: task.getOwner().getId(),
                    },
                },
                tags: {
                    connect: task.getTags().map((tag) => ({
                        id: tag.getId(),
                    })),
                },
                project: { connect: { id: task.getProjectId() } },
            },
            include: {
                tags: true,
                owner: true,
                project: true,
            },
        });
        return Task.from(taskPrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const getTaskById = async ({ id }: { id: number }): Promise<Task | null> => {
    try {
        const taskPrisma = await database.task.findUnique({
            where: { id },
            include: { owner: true, tags: true },
        });
        if (taskPrisma) {
            return Task.from(taskPrisma);
        }
        return null;
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const updateTask = async (changedTask: Task): Promise<Task> => {
    try {
        const taskPrisma = await database.task.update({
            where: { id: changedTask.getId() },
            data: {
                title: changedTask.getTitle(),
                description: changedTask.getDescription(),
                deadline: changedTask.getDeadline(),
                done: changedTask.getDone(),
                owner: {
                    connect: {
                        id: changedTask.getOwner().getId(),
                    },
                },
                tags: {
                    set: changedTask.getTags().map((tag) => ({
                        id: tag.getId(),
                    })),
                },
            },
            include: {
                tags: true,
                owner: true,
            },
        });
        return Task.from(taskPrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

export default { getAllTasks, createTask, getTaskById, updateTask };
