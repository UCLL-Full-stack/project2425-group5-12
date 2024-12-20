import { set } from 'date-fns';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import taskDb from '../../repository/task.db';
import { Tag } from '../../model/tag';
import taskService from '../../service/task.service';
import userDb from '../../repository/user.db';
import tagDb from '../../repository/tag.db';
import { TagInput, TaskInput, UserInput } from '../../types';
import { Project } from '../../model/project';
import projectDb from '../../repository/project.db';

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

const deadline = set(new Date(), { year: 2025, month: 10, date: 28, hours: 15 });

const tagInput: TagInput = { id: 1, title: 'Development' };

const tag = new Tag({ ...tagInput });
const tag2 = new Tag({ id: 2, title: 'high-priority' });

const task = new Task({
    id: 1,
    title: 'finish coding',
    description: 'finish full stack assignment',
    deadline,
    owner: user,
    tags: [tag],
    projectId: 1,
});

const project = new Project({
    title: 'fullstack',
    description: 'fullstack',
    owner: user,
    members: [user],
});

const tasks: Task[] = [task];

let mockTaskDbGetAllTasks: jest.SpyInstance<Promise<Task[]>, []>;
let mockTaskDbCreateTask: jest.SpyInstance<Promise<Task>, [Task]>;
let mockTaskDbGetTaskById: jest.SpyInstance<Promise<Task | null>, [{ id: number }]>;
let mockTaskDbChangeTask: jest.SpyInstance<Promise<Task>, [Task]>;
let mockUserDbGetUserById: jest.SpyInstance<Promise<User | null>, [{ id: number }]>;
let mockTagDbGetTagById: jest.SpyInstance<Promise<Tag | null>, [{ id: number }]>;
let mockTaskDbDeleteTaskById: jest.SpyInstance<Promise<void>, [id: number]>;
let mockUserDbGetUserByEmail: jest.SpyInstance<Promise<User | null>, [{ email: string }]>;
let mockProjectDbGetProjectById: jest.SpyInstance<Promise<Project | null>, [{ id: number }]>;

beforeEach(() => {
    mockTaskDbGetAllTasks = jest.spyOn(taskDb, 'getAllTasks');
    mockTaskDbCreateTask = jest.spyOn(taskDb, 'createTask');
    mockTaskDbGetTaskById = jest.spyOn(taskDb, 'getTaskById');
    mockTaskDbChangeTask = jest.spyOn(taskDb, 'updateTask');
    mockUserDbGetUserById = jest.spyOn(userDb, 'getUserById');
    mockTagDbGetTagById = jest.spyOn(tagDb, 'getTagById');
    mockTaskDbDeleteTaskById = jest.spyOn(taskDb, 'deleteTaskById');
    mockUserDbGetUserByEmail = jest.spyOn(userDb, 'getUserByEmail');
    mockProjectDbGetProjectById = jest.spyOn(projectDb, 'getProjectById');
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: existing tasks, when: getting all tasks, then: all tasks are returned', async () => {
    mockTaskDbGetAllTasks.mockResolvedValue(tasks);

    const result = await taskService.getAllTasks();

    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(
        new Task({
            id: 1,
            title: 'finish coding',
            description: 'finish full stack assignment',
            deadline: deadline,
            owner: user,
            tags: [tag],
            projectId: 1,
        })
    );
});

test('given: existing task, when: getting task by id, then: task with that id is returned', async () => {
    mockTaskDbGetTaskById.mockImplementation(async ({ id }: { id: number }) => {
        return id === 1 ? task : null;
    });

    const result = await taskService.getTaskById({ id: 1 });

    expect(result).toEqual(
        new Task({
            id: 1,
            title: 'finish coding',
            description: 'finish full stack assignment',
            deadline: deadline,
            owner: user,
            tags: [tag],
            projectId: 1,
        })
    );
});

test('given: invalid id for task, when: getting task by id, then: error is thrown', async () => {
    mockTaskDbGetTaskById.mockResolvedValue(null);

    await expect(taskService.getTaskById({ id: 1 })).rejects.toThrow('Task with id:1 not found');
});

test('given: valid values for task, when: task is created, then: task is created with those values', async () => {
    mockTagDbGetTagById.mockImplementation(async ({ id }: { id: number }) => {
        return id === 1 ? tag : null;
    });
    mockUserDbGetUserById.mockImplementation(async ({ id }: { id: number }) => {
        return id === 1 ? user : null;
    });
    mockProjectDbGetProjectById.mockResolvedValue(project);
    mockTaskDbCreateTask.mockResolvedValue(
        new Task({
            title: 'new task',
            description: 'description',
            deadline,
            owner: user,
            tags: [tag],
            projectId: 1,
        })
    );

    await taskService.createTask({
        title: 'new task',
        description: 'description',
        deadline,
        owner: { id: 1, ...userInput },
        tags: [tagInput],
        projectId: 1,
    });

    expect(mockTaskDbCreateTask).toHaveBeenCalledTimes(1);
    expect(mockTaskDbCreateTask).toHaveBeenLastCalledWith(
        expect.objectContaining({
            title: 'new task',
            description: 'description',
            deadline,
            owner: user,
            tags: [tag],
        })
    );
});

test('given: invalid owner for task, when: task is created, then: error is thrown', async () => {
    mockUserDbGetUserById.mockResolvedValue(null);

    await expect(
        taskService.createTask({
            title: 'new task',
            description: 'description',
            deadline,
            owner: userInput,
            tags: [tagInput],
            projectId: 1,
        })
    ).rejects.toThrow('Owner with id:1 not found');
});

test('given: invalid tag for task, when: task is created, then: error is thrown', async () => {
    mockUserDbGetUserById.mockResolvedValue(user);
    mockTagDbGetTagById.mockResolvedValue(null);

    await expect(
        taskService.createTask({
            title: 'new task',
            description: 'description',
            deadline,
            owner: userInput,
            tags: [tagInput],
            projectId: 1,
        })
    ).rejects.toThrow('Tag with id:1 not found.');
});

test('given: existing tag and task, when: adding tag to task, then: tag is added to task', async () => {
    mockTagDbGetTagById.mockResolvedValue(tag2);
    mockTaskDbGetTaskById.mockResolvedValue(task);
    mockTaskDbChangeTask.mockResolvedValue(task);

    const result = await taskService.addTagByIdByTaskId({ taskId: 1, tagId: 2 });

    expect(result.getTags().length).toEqual(2);
    expect(result.getTags()[1]).toEqual(tag2);
});

test('given: invalid tag and existing task, when: adding tag to task, then: error is thrown', async () => {
    mockTagDbGetTagById.mockResolvedValue(null);
    mockTaskDbGetTaskById.mockResolvedValue(task);

    await expect(taskService.addTagByIdByTaskId({ taskId: 1, tagId: 2 })).rejects.toThrow(
        'Tag with id:2 not found.'
    );
});

test('given: task, when: change status of task, then: status of task is changed', async () => {
    mockTaskDbGetTaskById.mockResolvedValue(task);
    mockTaskDbChangeTask.mockResolvedValue(task);

    const result = await taskService.toggleTaskDoneById({ id: 1 });

    expect(result.getDone()).toEqual(true);
});

test('given: invalid task id, when: changing task status, then: error is thrown', async () => {
    mockTaskDbGetTaskById.mockResolvedValue(null);

    await expect(taskService.toggleTaskDoneById({ id: 1 })).rejects.toThrow(
        'Task with id:1 not found.'
    );
});

test('given: valid task id, when: deleting a task, then: task is deleted', async () => {
    mockTaskDbGetTaskById.mockResolvedValue(task);
    mockTaskDbDeleteTaskById.mockResolvedValue();

    const result = await taskService.deleteTaskById({
        id: 1,
        userRole: 'ADMIN',
        userEmail: 'jack.doe@ucll.be',
    });

    expect(result.toString()).toEqual('Task deleted successfully!');
});

test('given: invalid task id, when: deleting a task, then: error is thrown', async () => {
    mockTaskDbGetTaskById.mockResolvedValue(null);

    await expect(
        taskService.deleteTaskById({ id: 500, userRole: 'ADMIN', userEmail: 'jack.doe@ucll.be' })
    ).rejects.toThrow('Task with id:500 not found.');
});

test('given: invalid user email, when: deleting a task, then: error is thrown', async () => {
    mockTaskDbGetTaskById.mockResolvedValue(task);
    mockUserDbGetUserByEmail.mockResolvedValue(null);

    await expect(
        taskService.deleteTaskById({ id: 1, userRole: 'USER', userEmail: 'jackie.doe@ucll.be' })
    ).rejects.toThrow('User with email:jackie.doe@ucll.be not found.');
});
