import { set } from 'date-fns';
import { Project } from '../model/project';
import { Task } from '../model/task';
import { User } from '../model/user';
import { Tag } from '../model/tag';

let currentId = 1;

const projects: Project[] = [];

const getAllProjects = (): Project[] => projects;

const createProject = (project: Project): Project => {
    project.setId(currentId++);
    projects.push(project);
    return project;
};

const changeProject = (projectToChange: Project): Project => {
    const index = projects.findIndex((projects) => projects.getId() === projectToChange.getId());
    projects[index] = projectToChange;
    return projectToChange;
};

const getProjectById = ({ id }: { id: number }): Project | null => {
    const project = projects.find((project) => project.getId() === id);
    return project || null;
};

export default { getAllProjects, changeProject, createProject, getProjectById };
