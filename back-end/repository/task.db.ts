import { set } from 'date-fns';
import { Task } from '../model/task';
import { User } from '../model/user';
import { Tag } from '../model/tag';
import database from './database';

let currentId = 1;
const tasks: Task[] = [];

const getAllTasks = async (): Promise<Task[]> => {
    const taskPrisma = await database.task.findMany({
        include: { owner: true}
    });
    return taskPrisma.map((taskPrisma) => Task.from(taskPrisma));
};

const createTask = async (task: Task): Promise<Task> => {
    await getAllTasks();
    task.setId(currentId++);
    tasks.push(task);
    return task;
};

const getTaskById = async ({ id }: { id: number }): Task | null => {
    const task = tasks.find((task) => task.getId() === id);
    return task || null;
};

const changeTask = async (changedTask: Task): Promise<Task> => {
    const index = tasks.findIndex((task) => task.getId() === changedTask.getId());
    tasks[index] = changedTask;
    return changedTask;
};

export default { getAllTasks, createTask, getTaskById, changeTask };
