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
    role: 'ADMIN',
};

const user = new User({
    firstName: userInput.firstName || '',
    lastName: userInput.lastName || '',
    email: userInput.email,
    password: userInput.password,
    role: userInput.role || 'USER',
});

const user2 = new User({
    id: 2,
    firstName: 'Lisa',
    lastName: 'Doe',
    email: 'lisa.doe@ucll.be',
    password: 'lisa123',
    role: 'USER',
});

const task = new Task({
    id: 1,
    title: 'coding',
    description: 'coding task',
    owner: user,
    deadline,
    tags: [],
    projectId: 1,
});

const task2 = new Task({
    id: 2,
    title: 'homework',
    description: 'homework task',
    owner: user,
    deadline,
    tags: [],
    projectId: 1,
});

const project = new Project({
    id: 1,
    title: 'Full-Stack',
    description: 'course',
    owner: user,
    tasks: [task],
});

const projects: Project[] = [project];

let mockProjectDbGetAllProjects: jest.SpyInstance<Promise<Project[]>, []>;
let mockProjectDbGetProjectById: jest.SpyInstance<Promise<Project | null>, [{ id: number }]>;
let mockProjectDbCreateProject: jest.SpyInstance<Promise<Project>, [{ project: Project }]>;
let mockProjectDbChangeProject: jest.SpyInstance<Promise<Project>, [{ projectToChange: Project }]>;
let mockTaskDbGetTaskById: jest.SpyInstance<Promise<Task | null>, [{ id: number }]>;
let mockUserDbGetUserById: jest.SpyInstance<Promise<User | null>, [{ id: number }]>;

beforeEach(() => {
    mockProjectDbGetAllProjects = jest.spyOn(projectDb, 'getAllProjects');
    mockProjectDbGetProjectById = jest.spyOn(projectDb, 'getProjectById');
    mockProjectDbCreateProject = jest.spyOn(projectDb, 'createProject');
    mockProjectDbChangeProject = jest.spyOn(projectDb, 'updateProject');
    mockTaskDbGetTaskById = jest.spyOn(taskDb, 'getTaskById');
    mockUserDbGetUserById = jest.spyOn(userDb, 'getUserById');
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: existing projects, when: getting all projects, then: all projects are returned', async () => {
    //given
    mockProjectDbGetAllProjects.mockResolvedValue(projects);

    //when
    const result = await projectService.getAllProjects({
        userRole: 'ADMIN',
        userEmail: 'admin@example.com',
    });

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

test('given: valid values for project, when: project is created, then: project is created with those values', async () => {
    // Given
    const owner = new User({
        id: 1,
        firstName: 'Jack',
        lastName: 'Doe',
        email: 'jack.doe@ucll.be',
        password: 'jack123',
        role: 'ADMIN',
    });

    mockUserDbGetUserById.mockResolvedValue(owner);
    mockProjectDbGetAllProjects.mockResolvedValue([]);
    mockProjectDbCreateProject.mockResolvedValue(
        new Project({ title: 'Full-Stack', description: 'course', owner })
    );

    // When
    await projectService.createProject(
        { title: 'Full-Stack', description: 'course', owner: { id: 1, ...userInput } },
        owner.getRole()
    );

    // Then
    expect(mockProjectDbCreateProject).toHaveBeenCalledTimes(1);
    expect(mockProjectDbCreateProject).toHaveBeenLastCalledWith(
        expect.objectContaining({
            project: expect.objectContaining({
                title: 'Full-Stack',
                description: 'course',
                owner,
                members: [owner],
                tasks: [],
            }),
        })
    );
});

test('given: invalid values for project, when: project is created, then: error is thrown', async () => {
    //given
    mockUserDbGetUserById.mockResolvedValue(null);
    //when
    const project = async () =>
        await projectService.createProject(
            {
                title: 'Full-Stack',
                description: 'course',
                owner: userInput,
            },
            'PROJECT_MANAGER'
        );

    //expect
    expect(project).rejects.toThrow('Owner with id:1 not found.');
});

test('given: existing projects, when: getting project by id, then: project with given id is returned', async () => {
    //given
    mockProjectDbGetProjectById.mockResolvedValue(project);

    //when
    const result = await projectService.getProjectById({ id: 1 });

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

test('given: invalid id for project, when: getting project by id, then: error is thrown', async () => {
    //given
    mockProjectDbGetProjectById.mockResolvedValue(null);

    //when
    const projecttest = async () => await projectService.getProjectById({ id: 1 });

    //then
    await expect(projecttest()).rejects.toThrow('Project with id:1 not found.');
});

test('given: existing project, when: changing project status, then: status of project is changed', async () => {
    //given
    mockProjectDbGetProjectById.mockResolvedValue(project);
    const testProject = project;
    mockProjectDbChangeProject.mockResolvedValue(testProject);

    //when
    const result = await projectService.toggleProjectDoneById({ id: 1 });

    //then
    expect(result.getDone()).toEqual(true);
});

test('given: inxisting project id, when: changing project status, then: error is thrown', async () => {
    //given
    mockProjectDbGetProjectById.mockResolvedValue(null);

    //when
    const toggleStatus = async () => await projectService.toggleProjectDoneById({ id: 1 });

    //then
    await expect(toggleStatus()).rejects.toThrow('Project with id:1 not found.');
});

test('given: existing member and project, when: adding member to project, then: member id added to project', async () => {
    //given
    mockProjectDbGetProjectById.mockResolvedValue(project);
    mockUserDbGetUserById.mockImplementation(async ({ id }: { id: number }) => {
        return (id === 2 && user2) || null;
    });
    mockProjectDbChangeProject.mockResolvedValue(project);

    //when
    const result = await projectService.addMemberByIdByProjectId({
        projectId: 1,
        memberId: 2,
        userRole: 'ADMIN',
        userEmail: 'john.doe@ucll.be',
    });

    //then
    expect(result.getMembers().length).toEqual(2);
    expect(result.getMembers()[1]).toEqual(user2);
});

test('given: invalid id for project, when: adding member to project, then: error is thrown', () => {
    //given
    mockProjectDbGetProjectById.mockResolvedValue(null);

    //when
    const result = async () =>
        await projectService.addMemberByIdByProjectId({
            projectId: 1,
            memberId: 2,
            userRole: 'ADMIN',
            userEmail: 'john.doe@ucll.be',
        });

    //then
    expect(result).rejects.toThrow('Project with id:1 not found.');
});

test('given: invalid member id and project, when: adding member to project, then: error is thrown', async () => {
    //given
    mockProjectDbGetProjectById.mockResolvedValue(project);
    mockUserDbGetUserById.mockResolvedValue(null);

    //when
    const result = async () =>
        await projectService.addMemberByIdByProjectId({
            projectId: 1,
            memberId: 2,
            userRole: 'ADMIN',
            userEmail: 'john.doe@ucll.be',
        });

    //then
    expect(result).rejects.toThrow('User with id:2 not found.');
});
