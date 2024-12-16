import { UnauthorizedError } from 'express-jwt';
import { Project } from '../model/project';
import projectDb from '../repository/project.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { ProjectInput, Role } from '../types';

const getAllProjects = async ({
    userRole,
    userEmail,
}: {
    userRole: Role;
    userEmail: string;
}): Promise<Project[]> => {
    if (userRole === 'ADMIN') return await projectDb.getAllProjects();
    if (userRole === 'USER')
        return await projectDb.getAllProjectsByMember({ memberEmail: userEmail });
    if (userRole === 'PROJECT_MANAGER')
        return await projectDb.getAllProjectsByMember({ memberEmail: userEmail });
    throw new UnauthorizedError('credentials_required', { message: 'Give role' });
};

const createProject = async (
    { title, description, owner: userInput }: ProjectInput,
    userRole: string
): Promise<Project> => {
    if (userRole === 'ADMIN' || userRole === 'PROJECT_MANAGER') {
        const projects = await projectDb.getAllProjects();
        if (projects.some((project) => project.getTitle() === title)) {
            throw new Error(`Project with title:${title} already exists.`);
        }
        if (!userInput.id) throw new Error('Owner id is required.');
        const owner = await userDb.getUserById({ id: userInput.id });
        console.log(owner);
        if (!owner) throw new Error(`Owner with id:${userInput.id} not found.`);

        const project = new Project({ title, description, owner });
        return await projectDb.createProject({ project });
    }
    if (userRole === 'USER')
        throw new UnauthorizedError('invalid_token', { message: 'Not authorized.' });
    throw new UnauthorizedError('credentials_required', { message: 'Give role' });
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
    return await projectDb.updateProject({ projectToChange: project });
};

const addMemberByIdByProjectId = async ({
    userRole,
    userEmail,
    projectId,
    memberId,
}: {
    projectId: number;
    memberId: number;
    userRole: string;
    userEmail: string;
}): Promise<Project> => {
    if (userRole === 'ADMIN') {
        const project = await projectDb.getProjectById({ id: projectId });
        if (!project) throw new Error(`Project with id:${projectId} not found.`);
        const user = await userDb.getUserById({ id: memberId });
        if (!user) throw new Error(`User with id:${memberId} not found.`);

        project.addMember(user);
        return projectDb.updateProject({ projectToChange: project });
    }
    if (userRole === 'PROJECT_MANAGER') {
        const project = await projectDb.getProjectById({ id: projectId });
        if (!project) throw new Error(`Project with id:${projectId} not found.`);

        if (project.getOwner().getEmail() != userEmail)
            throw new Error(`You are not project manager of this project.`);

        const user = await userDb.getUserById({ id: memberId });
        if (!user) throw new Error(`User with id:${memberId} not found.`);

        project.addMember(user);
        return projectDb.updateProject({ projectToChange: project });
    }
    if (userRole === 'USER')
        throw new UnauthorizedError('invalid_token', { message: 'Not authorized.' });
    throw new UnauthorizedError('credentials_required', { message: 'Give role' });
};

export default {
    getAllProjects,
    createProject,
    toggleProjectDoneById,
    addMemberByIdByProjectId,
    getProjectById,
};
