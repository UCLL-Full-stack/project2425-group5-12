import { set } from 'date-fns';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import taskDb from '../../repository/task.db';
import { title } from 'process';
import { Tag } from '../../model/tag';
import taskService from '../../service/task.service';
import userDb from '../../repository/user.db';
import tagDb from '../../repository/tag.db';
import { TagInput, TaskInput, UserInput } from '../../types';
import { mock } from 'node:test';

const userInput: UserInput = {
    id: 1,
    firstName: 'Jack',
    lastName: 'Doe',
    email: 'jack.doe@ucll.be',
    password: 'jack123',
    role: 'USER',
};

const user = new User({ ...userInput });

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
});

const tasks: Task[] = [task];

let mockTaskDbGetAllTasks: jest.SpyInstance<Task[]>;
let mockTaskDbCreateTask: jest.SpyInstance<Task, [Task]>;
let mockTaskDbGetTaskById: jest.SpyInstance<Task | null, [{ id: number }]>;
let mockTaskDbChangeTask: jest.SpyInstance<Task, [Task]>;
let mockUserDbGetUserById: jest.SpyInstance<User | null, [{ id: number }]>;
let mockTagDbGetTagById: jest.SpyInstance<Tag | null, [{ id: number }]>;

beforeEach(() => {
    mockTaskDbGetAllTasks = jest.spyOn(taskDb, 'getAllTasks');
    mockTaskDbCreateTask = jest.spyOn(taskDb, 'createTask');
    mockTaskDbGetTaskById = jest.spyOn(taskDb, 'getTaskById');
    mockTaskDbChangeTask = jest.spyOn(taskDb, 'changeTask');
    mockUserDbGetUserById = jest.spyOn(userDb, 'getUserById');
    mockTagDbGetTagById = jest.spyOn(tagDb, 'getTagById');
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: existing tasks, when: getting all tasks, then: all tasks are returned', () => {
    //given
    mockTaskDbGetAllTasks.mockReturnValue(tasks);

    //when
    const result = taskService.getAllTasks();

    //then
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(
        new Task({
            id: 1,
            title: 'finish coding',
            description: 'finish full stack assignment',
            deadline: deadline,
            owner: user,
            tags: [tag],
        })
    );
});

test('given: existing task, when: getting task by id, then: task with that id is returned', () => {
    //given
    mockTaskDbGetTaskById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && task) || null;
    });

    //when
    const result = taskService.getTaskById({ id: 1 });

    //then
    expect(result).toEqual(
        new Task({
            id: 1,
            title: 'finish coding',
            description: 'finish full stack assignment',
            deadline: deadline,
            owner: user,
            tags: [tag],
        })
    );
});

test('given: invalid id for task, when: getting task by id, then: error is thrown', () => {
    //given
    mockTaskDbGetTaskById.mockReturnValue(null);

    //when
    const task = () => taskService.getTaskById({ id: 1 });

    //then
    expect(task).toThrow('Task with id:1 not found');
});

test('given: valid values for task, when: task is created, then: task is created with those values', () => {
    //given
    mockTagDbGetTagById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && tag) || null;
    });
    mockUserDbGetUserById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && user) || null;
    });

    //when
    taskService.createTask({
        title: 'new task',
        description: 'description',
        deadline,
        owner: userInput,
        tags: [tagInput],
    });

    //then
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

test('given: invalid owner for task, when: task is created, then: error is thrown', () => {
    //given
    mockUserDbGetUserById.mockReturnValue(null);

    //when
    const task = () =>
        taskService.createTask({
            title: 'new task',
            description: 'description',
            deadline,
            owner: userInput,
            tags: [tagInput],
        });

    //then
    expect(task).toThrow('Owner with id:1 not found');
});

test('given: invalid tag for task, when: task is created, then: error is thrown', () => {
    //given
    mockUserDbGetUserById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && user) || null;
    });

    mockTagDbGetTagById.mockReturnValue(null);

    //when
    const task = () =>
        taskService.createTask({
            title: 'new task',
            description: 'description',
            deadline,
            owner: userInput,
            tags: [tagInput],
        });

    //then
    expect(task).toThrow('Tag with id:1 not found.');
});

test('given: existing tag and task, when: adding tag to task, then: tag is added to task', () => {
    //given
    mockTagDbGetTagById.mockImplementation(({ id }: { id: number }) => {
        return (id === 2 && tag2) || null;
    });
    mockTaskDbGetTaskById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && task) || null;
    });
    mockTaskDbChangeTask.mockReturnValue(task);

    //when
    const result = taskService.addTagByIdByTaskId({ taskId: 1, tagId: 2 });

    //then
    expect(result.getTags().length).toEqual(2);
    expect(result.getTags()[1]).toEqual(tag2);
});

test('given: invalid tag and existing task, when: adding tag to task, then: error is thrown', () => {
    //given
    mockTagDbGetTagById.mockReturnValue(null);

    mockTaskDbGetTaskById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && task) || null;
    });

    //when
    const result = () => taskService.addTagByIdByTaskId({ taskId: 1, tagId: 2 });

    //then
    expect(result).toThrow(`Tag with id:2 not found.`);
});

test('given: task, when: change status of task, then: status of task is changed', () => {
    //given
    mockTaskDbGetTaskById.mockImplementation(({ id }: { id: number }) => {
        return (id === 1 && task) || null;
    });
    mockTaskDbChangeTask.mockReturnValue(task);

    //when
    const result = taskService.toggleTaskDoneById({ id: 1 });

    //then
    expect(result.getDone()).toEqual(true);
});

test('given: invalid tag and existing task, when: adding tag to task, then: error is thrown', () => {
    //given
    mockTaskDbGetTaskById.mockReturnValue(null);

    //when
    const result = () => taskService.toggleTaskDoneById({ id: 1 });

    //then
    expect(result).toThrow(`Task with id:1 not found.`);
});
