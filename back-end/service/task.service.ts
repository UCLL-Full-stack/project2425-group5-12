import { Tag } from '../model/tag';
import { Task } from '../model/task';
import tagDb from '../repository/tag.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { TaskInput } from '../types';

const getAllTasks = async (): Promise<Task[]> => taskDb.getAllTasks();

const createTask = async ({
    title,
    description,
    deadline,
    owner: userInput,
    tags: tagInput,
}: TaskInput): Promise<Task> => {
    const deadlineDate = new Date(deadline);

    if (!userInput.id) throw new Error('Owner id is required to create a task.');
    const owner = await userDb.getUserById({ id: userInput.id });

    if (!owner) throw new Error(`Owner with id:${userInput.id} not found.`);

    const tags: Tag[] = [];
    tagInput.forEach((tag) => {
        if (!tag.id) throw new Error(`Tag id of all tasks is required to create task.`);
        const tagToPush = tagDb.getTagById({ id: tag.id });
        if (tagToPush) {
            tags.push(tagToPush);
        } else throw new Error(`Tag with id:${tag.id} not found.`);
    });

    const task = new Task({ title, description, deadline: deadlineDate, owner, tags });
    return taskDb.createTask(task);
};

const updateTask = async ({
    id,
    title,
    description,
    deadline,
    owner: userInput,
    tags: tagInput,
}: TaskInput): Promise<Task> => {
    if (!id) throw new Error('Task id is required to create a task.');
    const task = getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);

    const deadlineDate = new Date(deadline);

    if (!userInput.id) throw new Error('Owner id is required to change a task.');
    const owner = await userDb.getUserById({ id: userInput.id });

    if (!owner) throw new Error(`Owner with id:${userInput.id} not found.`);

    const tags: Tag[] = [];
    tagInput.forEach((tag) => {
        if (!tag.id) throw new Error(`Tag id of all tasks is required to change task.`);
        const tagToPush = tagDb.getTagById({ id: tag.id });
        if (tagToPush) {
            tags.push(tagToPush);
        } else throw new Error(`Tag with id:${tag.id} not found.`);
    });

    const changedTask = new Task({ id, title, description, deadline: deadlineDate, tags, owner });
    return taskDb.changeTask(changedTask);
};

const getTaskById = async({ id }: { id: number }): Promise<Task> => {
    const task = taskDb.getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);
    return task;
};

const addTagByIdByTaskId = async ({ taskId, tagId }: { taskId: number; tagId: number }): Promise<Task> => {
    const task =await getTaskById({ id: taskId });
    if (!task) throw new Error(`Task with id:${taskId} not found.`);

    const tag = tagDb.getTagById({ id: tagId });
    if (!tag) throw new Error(`Tag with id:${tagId} not found.`);

    task.addTag(tag);
    return taskDb.changeTask(task);
};

const toggleTaskDoneById = async ({ id }: { id: number }): Promise<Task> => {
    const task = taskDb.getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);
    task.switchDone();
    return taskDb.changeTask(task);
};
export default {
    getAllTasks,
    createTask,
    getTaskById,
    toggleTaskDoneById,
    addTagByIdByTaskId,
    updateTask,
};
