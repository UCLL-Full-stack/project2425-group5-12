import { Project } from '../model/project';
import projectDb from '../repository/project.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { ProjectInput } from '../types';

const getAllProjects = (): Project[] => projectDb.getAllProjects();

const createProject = async ({
    title,
    description,
    owner: userInput,
}: ProjectInput): Promise<Project> => {
    if (!userInput.id) throw new Error('Owner id is required.');
    const owner = await userDb.getUserById({ id: userInput.id });
    if (!owner) throw new Error(`Owner with id:${userInput.id} not found.`);

    const project = new Project({ title, description, owner });
    return projectDb.createProject(project);
};

const getProjectById = ({ id }: { id: number }): Project => {
    const project = projectDb.getProjectById({ id });
    if (!project) throw new Error(`Project with id:${id} not found.`);
    return project;
};

const toggleProjectDoneById = ({ id }: { id: number }) => {
    const project = projectDb.getProjectById({ id });
    if (!project) throw new Error(`Project with id:${id} not found.`);
    project.switchDone();
    return projectDb.changeProject(project);
};

const addTaskByIdByProjectId = ({
    projectId,
    taskId,
}: {
    projectId: number;
    taskId: number;
}): Project => {
    const project = projectDb.getProjectById({ id: projectId });
    if (!project) throw new Error(`Project with id:${projectId} not found.`);

    const task = taskDb.getTaskById({ id: taskId });
    if (!task) throw new Error(`Cannot add task, task with did:${taskId} not found.`);

    project.addTask(task);
    return projectDb.changeProject(project);
};

const addMemberByIdByProjectId = async ({
    projectId,
    memberId,
}: {
    projectId: number;
    memberId: number;
}): Promise<Project> => {
    const project = projectDb.getProjectById({ id: projectId });
    if (!project) throw new Error(`Project with id:${projectId} not found.`);

    const user = await userDb.getUserById({ id: memberId });
    if (!user) throw new Error(`User with id:${memberId} not found.`);

    project.addMember(user);
    return projectDb.changeProject(project);
};

export default {
    getAllProjects,
    createProject,
    toggleProjectDoneById,
    addMemberByIdByProjectId,
    addTaskByIdByProjectId,
    getProjectById,
};
