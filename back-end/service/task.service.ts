import { Tag } from '../model/tag';
import { Task } from '../model/task';
import tagDb from '../repository/tag.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { TaskInput } from '../types';

const getAllTasks = (): Task[] => taskDb.getAllTasks();

const createTask = ({
    title,
    description,
    deadline,
    owner: userInput,
    tags: tagInput,
}: TaskInput): Task => {
    const deadlineDate = new Date(deadline);

    if (!userInput.id) throw new Error('Owner id is required to create a task.');
    const owner = userDb.getUserById({ id: userInput.id });

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

const getTaskById = ({ id }: { id: number }): Task => {
    const task = taskDb.getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);
    return task;
};

const addTagByIdByTaskId = ({ taskId, tagId }: { taskId: number; tagId: number }): Task => {
    const task = getTaskById({ id: taskId });
    if (!task) throw new Error(`Task with id:${tagId} not found.`);

    const tag = tagDb.getTagById({ id: tagId });
    if (!tag) throw new Error(`Tag with id:${tagId} not found.`);

    task.addTag(tag);
    return taskDb.changeTask(task);
};

const toggleTaskDoneById = ({ id }: { id: number }) => {
    const task = taskDb.getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);
    task.switchDone();
    return taskDb.changeTask(task);
};

export default { getAllTasks, createTask, getTaskById, toggleTaskDoneById, addTagByIdByTaskId };
