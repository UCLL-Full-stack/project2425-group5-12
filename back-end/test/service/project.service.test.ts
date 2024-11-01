import { set } from 'date-fns';
import { Project } from '../../model/project';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import { TaskInput, UserInput } from '../../types';
import projectDb from '../../repository/project.db';
import userDb from '../../repository/user.db';
import taskDb from '../../repository/task.db';
import projectService from '../../service/project.service';

const deadline = set(new Date(), { year: 2025, month: 10, date: 28, hours: 15 });

const userInput: UserInput = {
    id: 1,
    firstName: 'Jack',
    lastName: 'Doe',
    email: 'jack.doe@ucll.be',
    password: 'jack123',
    role: 'user',
};

const user = new User({ ...userInput });

const user2 = new User({
    id: 2,
    firstName: 'Lisa',
    lastName: 'Doe',
    email: 'lisa.doe@ucll.be',
    password: 'lisa123',
    role: 'user',
});

const task = new Task({
    id: 1,
    title: 'coding',
    description: 'coding task',
    owner: user,
    deadline,
    tags: [],
});

const task2 = new Task({
    id: 2,
    title: 'homework',
    description: 'homework task',
    owner: user,
    deadline,
    tags: [],
});

const project = new Project({
    id: 1,
    title: 'Full-Stack',
    description: 'course',
    owner: user,
    tasks: [task],
});

const projects: Project[] = [project];

let mockProjectDbGetAllProjects: jest.SpyInstance<Project[]>;
let mockProjectDbGetProjectById: jest.SpyInstance<Project | null, [{ id: number }]>;
let mockProjectDbCreateProject: jest.SpyInstance<Project, [Project]>;
let mockProjectDbChangeProject: jest.SpyInstance<Project, [Project]>;
let mockTaskDbGetTaskById: jest.SpyInstance<Task | null, [{ id: number }]>;
let mockUserDbGetUserById: jest.SpyInstance<User | null, [{ id: number }]>;

beforeEach(() => {
    mockProjectDbGetAllProjects = jest.spyOn(projectDb, 'getAllProjects');
    mockProjectDbGetProjectById = jest.spyOn(projectDb, 'getProjectById');
    mockProjectDbCreateProject = jest.spyOn(projectDb, 'createProject');
    mockProjectDbChangeProject = jest.spyOn(projectDb, 'changeProject');
    mockTaskDbGetTaskById = jest.spyOn(taskDb, 'getTaskById');
    mockUserDbGetUserById = jest.spyOn(userDb, 'getUserById');
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: existing projects, when: getting all projects, then: all projects are returned', () => {
    //given
    mockProjectDbGetAllProjects.mockReturnValue(projects);

    //when
    const result = projectService.getAllProjects();

    //then
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(
        new Project({
            id: 1,
            title: 'Full-Stack',
            description: 'course',
            owner: user,
            tasks: [task],
        })
    );
});

test('given: valid values for project, when: project is created, then: project is created with those values', () => {
    //given
    mockUserDbGetUserById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && user) || null;
    });

    //when
    projectService.createProject({ title: 'Full-Stack', description: 'course', owner: userInput });

    //then
    expect(mockProjectDbCreateProject).toHaveBeenCalledTimes(1);
    expect(mockProjectDbCreateProject).toHaveBeenLastCalledWith(
        expect.objectContaining({
            title: 'Full-Stack',
            description: 'course',
            owner: user,
            members: [user],
            tasks: [],
        })
    );
});

test('given: invalid values for project, when: task is created, then: error is thrown', () => {
    //given
    mockUserDbGetUserById.mockReturnValue(null);

    //when
    const project = () =>
        projectService.createProject({
            title: 'Full-Stack',
            description: 'course',
            owner: userInput,
        });

    //expect
    expect(project).toThrow('Owner with id:1 not found.');
});

test('given: existing projects, when: getting project by id, then: project with given id is returned', () => {
    //given
    mockProjectDbGetProjectById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && project) || null;
    });

    //when
    const result = projectService.getProjectById({ id: 1 });

    //then
    expect(result).toEqual(
        new Project({
            id: 1,
            title: 'Full-Stack',
            description: 'course',
            owner: user,
            members: [user],
            tasks: [task],
        })
    );
});

test('given: invalid id for project, when: getting project by id, then: error is thrown', () => {
    //given
    mockProjectDbGetProjectById.mockReturnValue(null);

    //when
    const project = () => projectService.getProjectById({ id: 1 });

    //then
    expect(project).toThrow('Project with id:1 not found.');
});

test('given: existing project, when: changing project status, then: status of project is changed', () => {
    //given
    mockProjectDbGetProjectById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && project) || null;
    });

    //when
    const result = projectService.toggleProjectDoneById({ id: 1 });

    //then
    expect(result.getDone()).toEqual(true);
});

test('given: existing project, when: changing project status, then: status of project is changed', () => {
    //given
    mockProjectDbGetProjectById.mockReturnValue(null);

    //when
    const project = () => projectService.toggleProjectDoneById({ id: 1 });

    //then
    expect(project).toThrow('Project with id:1 not found.');
});

test('given: existing task and project, when: adding task to project, then: task id added to project', () => {
    //given
    mockProjectDbGetProjectById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && project) || null;
    });
    mockTaskDbGetTaskById.mockImplementation(({ id }: { id: number }) => {
        return (id === 2 && task2) || null;
    });
    mockProjectDbChangeProject.mockReturnValue(project);

    //when
    const result = projectService.addTaskByIdByProjectId({ projectId: 1, taskId: 2 });

    //then
    expect(result.getTasks().length).toEqual(2);
    expect(result.getTasks()[1]).toEqual(task2);
});

test('given: invalid id for project, when: adding task to project, then: error is thrown', () => {
    //given
    mockProjectDbGetProjectById.mockReturnValue(null);

    //when
    const result = () => projectService.addTaskByIdByProjectId({ projectId: 1, taskId: 2 });

    //then
    expect(result).toThrow('Project with id:1 not found.');
});

test('given: invalid task id and project, when: adding task to project, then: error is thrown', () => {
    //given
    mockProjectDbGetProjectById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && project) || null;
    });
    mockTaskDbGetTaskById.mockReturnValue(null);

    //when
    const result = () => projectService.addTaskByIdByProjectId({ projectId: 1, taskId: 2 });

    //then
    expect(result).toThrow('Task with id:2 not found.');
});

test('given: existing member and project, when: adding member to project, then: member id added to project', () => {
    //given
    mockProjectDbGetProjectById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && project) || null;
    });
    mockUserDbGetUserById.mockImplementation(({ id }: { id: number }) => {
        return (id === 2 && user2) || null;
    });
    mockProjectDbChangeProject.mockReturnValue(project);

    //when
    const result = projectService.addMemberByIdByProjectId({ projectId: 1, memberId: 2 });

    //then
    expect(result.getMembers().length).toEqual(2);
    expect(result.getMembers()[1]).toEqual(user2);
});

test('given: invalid id for project, when: adding member to project, then: error is thrown', () => {
    //given
    mockProjectDbGetProjectById.mockReturnValue(null);

    //when
    const result = () => projectService.addMemberByIdByProjectId({ projectId: 1, memberId: 2 });

    //then
    expect(result).toThrow('Project with id:1 not found.');
});

test('given: invalid member id and project, when: adding member to project, then: error is thrown', () => {
    //given
    mockProjectDbGetProjectById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && project) || null;
    });
    mockUserDbGetUserById.mockReturnValue(null);

    //when
    const result = () => projectService.addMemberByIdByProjectId({ projectId: 1, memberId: 2 });

    //then
    expect(result).toThrow('User with id:2 not found.');
});
