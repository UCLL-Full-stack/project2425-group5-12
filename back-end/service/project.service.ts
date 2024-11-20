import { Project } from '../model/project';
import projectDb from '../repository/project.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { ProjectInput } from '../types';

const getAllProjects = async (): Promise<Project[]> => await projectDb.getAllProjects();

const createProject = async ({
    title,
    description,
    owner: userInput,
}: ProjectInput): Promise<Project> => {
    if (!userInput.id) throw new Error('Owner id is required.');
    const owner = await userDb.getUserById({ id: userInput.id });
    if (!owner) throw new Error(`Owner with id:${userInput.id} not found.`);

    const project = new Project({ title, description, owner });
    return await projectDb.createProject({ project });
};

const getProjectById = async ({ id }: { id: number }): Promise<Project> => {
    const project = await projectDb.getProjectById({ id });
    if (!project) throw new Error(`Project with id:${id} not found.`);
    return project;
};

const toggleProjectDoneById = async ({ id }: { id: number }) => {
    const project = await projectDb.getProjectById({ id });
    if (!project) throw new Error(`Project with id:${id} not found.`);
    project.switchDone();
    return await projectDb.updateProject(project);
};

/*const addTaskByIdByProjectId = async ({
    projectId,
    taskId,
}: {
    projectId: number;
    taskId: number;
}): Promise<Project> => {
    const project = await projectDb.getProjectById({ id: projectId });
    if (!project) throw new Error(`Project with id:${projectId} not found.`);

    const task = await taskDb.getTaskById({ id: taskId });
    if (!task) throw new Error(`Cannot add task, task with id:${taskId} not found.`);

    project.addTask(task);
    return await projectDb.updateProject(project);
};*/

const addMemberByIdByProjectId = async ({
    projectId,
    memberId,
}: {
    projectId: number;
    memberId: number;
}): Promise<Project> => {
    const project = await projectDb.getProjectById({ id: projectId });
    if (!project) throw new Error(`Project with id:${projectId} not found.`);

    const user = await userDb.getUserById({ id: memberId });
    if (!user) throw new Error(`User with id:${memberId} not found.`);

    project.addMember(user);
    return projectDb.updateProject(project);
};

export default {
    getAllProjects,
    createProject,
    toggleProjectDoneById,
    addMemberByIdByProjectId,
    /*addTaskByIdByProjectId,*/
    getProjectById,
};
