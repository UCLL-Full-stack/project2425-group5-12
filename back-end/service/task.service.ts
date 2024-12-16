import { Tag } from '../model/tag';
import { Task } from '../model/task';
import projectDb from '../repository/project.db';
import tagDb from '../repository/tag.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { TaskInput } from '../types';

const getAllTasks = async (): Promise<Task[]> => await taskDb.getAllTasks();

const createTask = async ({
    title,
    description,
    deadline,
    owner: userInput,
    tags: tagInput,
    projectId,
}: TaskInput): Promise<Task> => {
    const deadlineDate = new Date(deadline);

    if (!userInput.id) throw new Error('Owner id is required to create a task.');
    const owner = await userDb.getUserById({ id: userInput.id });
    if (!owner) throw new Error(`Owner with id:${userInput.id} not found.`);

    if (!projectId) throw new Error('Project id is required to create a task.');
    const project = await projectDb.getProjectById({ id: projectId });
    if (!project) throw new Error(`Project with id:${projectId} not found.`);

    if (!project.getMembers().some((member) => owner.getId() === member.getId()))
        throw new Error(`User not a member of project.`);

    const tags: Tag[] = await Promise.all(
        tagInput.map(async (tag) => {
            if (!tag.id) throw new Error(`Tag id of all tasks is required to change task.`);
            const tagToPush = await tagDb.getTagById({ id: tag.id });
            if (!tagToPush) throw new Error(`Tag with id:${tag.id} not found.`);
            return tagToPush;
        })
    );

    const task = new Task({ title, description, deadline: deadlineDate, owner, tags, projectId });
    return await taskDb.createTask(task);
};

const updateTask = async ({
    id,
    title,
    description,
    deadline,
    owner: userInput,
    tags: tagInput,
    projectId,
}: TaskInput): Promise<Task> => {
    if (!id) throw new Error('Task id is required to create a task.');
    const task = getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);

    const deadlineDate = new Date(deadline);

    if (!userInput.id) throw new Error('Owner id is required to change a task.');
    const owner = await userDb.getUserById({ id: userInput.id });

    if (!owner) throw new Error(`Owner with id:${userInput.id} not found.`);

    if (!projectId) throw new Error('Project id is required to create a task.');
    const project = await projectDb.getProjectById({ id: projectId });
    if (!project) throw new Error(`Project with id:${projectId} not found.`);

    if (!project.getMembers().some((member) => owner.getId() === member.getId()))
        throw new Error(`User not a member of project.`);

    const tags: Tag[] = await Promise.all(
        tagInput.map(async (tag) => {
            if (!tag.id) throw new Error(`Tag id of all tasks is required to change task.`);
            const tagToPush = await tagDb.getTagById({ id: tag.id });
            if (!tagToPush) throw new Error(`Tag with id:${tag.id} not found.`);
            return tagToPush;
        })
    );

    const changedTask = new Task({
        id,
        title,
        description,
        deadline: deadlineDate,
        tags,
        owner,
        projectId,
    });
    return await taskDb.updateTask(changedTask);
};

const getTaskById = async ({ id }: { id: number }): Promise<Task> => {
    const task = await taskDb.getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);
    return task;
};

const addTagByIdByTaskId = async ({
    taskId,
    tagId,
}: {
    taskId: number;
    tagId: number;
}): Promise<Task> => {
    const task = await getTaskById({ id: taskId });
    if (!task) throw new Error(`Task with id:${taskId} not found.`);

    const tag = await tagDb.getTagById({ id: tagId });
    if (!tag) throw new Error(`Tag with id:${tagId} not found.`);

    task.addTag(tag);
    return await taskDb.updateTask(task);
};

const toggleTaskDoneById = async ({ id }: { id: number }): Promise<Task> => {
    const task = await taskDb.getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);
    task.switchDone();
    return await taskDb.updateTask(task);
};

const deleteTaskById = async ({
    id,
    userRole,
    userEmail,
}: {
    id: number;
    userRole: string;
    userEmail: string;
}) => {
    const task = await taskDb.getTaskById({ id });
    if (!task) throw new Error(`Task with id:${id} not found.`);
    if (userRole === 'ADMIN') {
        await taskDb.deleteTaskById(id);
    } else {
        const user = await userDb.getUserByEmail({ email: userEmail });
        if (!user) throw new Error(`User with id:${id} not found.`);
        if (user.getId() != task.getOwner().getId()) throw new Error(`User not owner of task.`);
        await taskDb.deleteTaskById(id);
    }
};

export default {
    getAllTasks,
    createTask,
    getTaskById,
    toggleTaskDoneById,
    addTagByIdByTaskId,
    updateTask,
    deleteTaskById,
};
