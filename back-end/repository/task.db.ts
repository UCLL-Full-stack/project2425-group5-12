import { Task } from '../model/task';

let currentId = 1;

const tasks: Task[] = [];

const getAllTasks = (): Task[] => tasks;

const createTask = (task: Task): Task => {
    task.setId(currentId++);
    tasks.push(task);
    return task;
};

const getTaskById = ({ id }: { id: number }): Task | null => {
    const task = tasks.find((task) => task.getId() === id);
    return task || null;
};

const changeTask = (changedTask: Task): Task => {
    const index = tasks.findIndex((task) => task.getId() === changedTask.getId());
    tasks[index] = changedTask;
    return changedTask;
};

export default { getAllTasks, createTask, getTaskById, changeTask };
