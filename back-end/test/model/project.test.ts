import { add, set } from 'date-fns';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import { Tag } from '../../model/tag';
import { Project } from '../../model/project';
import exp from 'constants';

const user1 = new User({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@ucll.be',
    password: 'john123',
    role: 'USER',
});
const user2 = new User({
    firstName: 'Jane',
    lastName: 'Toe',
    email: 'jane.toe@ucll.be',
    password: 'jane123',
    role: 'USER',
});
const deadline1 = set(new Date(), { year: 2025, month: 10, date: 28, hours: 15 });
const deadline2 = set(new Date(), { year: 2025, month: 11, date: 28, hours: 15 });

const task1 = new Task({
    title: 'Finish coding',
    description: 'Finish coding assignment for full-stack development.',
    deadline: deadline1,
    owner: user1,
    tags: [],
});
const task2 = new Task({
    title: 'Finish studying',
    description: 'Finish studying chapter 7',
    deadline: deadline2,
    owner: user2,
    tags: [],
});

const title = 'Full-Stack';
const description = 'To do list full-stack development';

test('given: valid values for project, when: project is created, then: project is created with those values', () => {
    //when
    const project = new Project({ title, description, owner: user1 });

    //then
    expect(project.getTitle()).toEqual('Full-Stack');
    expect(project.getMembers().length).toEqual(1);
    expect(project.getMembers()[0]).toEqual(user1);
    expect(project.getOwner()).toEqual(user1);
    expect(project.getTasks().length).toEqual(0);
});

test('given: invalid title for project, when: project is created, then: error is thrown', () => {
    //when
    const project = () => new Project({ title: '', description, owner: user1 });

    //then
    expect(project).toThrow('Title is required');
});

test('given: existing project, when: new member is added, then: new member is added to project', () => {
    //given
    const project = new Project({ title, description, owner: user1 });

    //when
    project.addMember(user2);

    //then
    expect(project.getMembers().length).toEqual(2);
    expect(project.getMembers()[1]).toEqual(user2);
});

test('given: existing project, when: new member is added again, then: error is thrown', () => {
    //given
    const project = new Project({ title, description, owner: user1 });

    //when
    const addMember = () => project.addMember(user1);

    //then
    expect(addMember).toThrow('User already member of project');
});

test('given: existing project, when: new task is added, then: new task is added to project', () => {
    //given
    const project = new Project({ title, description, owner: user1 });

    //when
    project.addTask(task1);

    //then
    expect(project.getTasks().length).toEqual(1);
    expect(project.getTasks()[0]).toEqual(task1);
});

test('given: existing project, when: new task is added again, then: error is thrown', () => {
    //given
    const project = new Project({ title, description, tasks: [task1], owner: user1 });

    //when
    const addTask = () => project.addTask(task1);

    //then
    expect(addTask).toThrow('Task already in project');
});

test('given: existing project, when: new task is added but task owner not in project, then: error is thrown', () => {
    //given
    const project = new Project({ title, description, tasks: [task1], owner: user1 });

    //when
    const addTask = () => project.addTask(task2);

    //then
    expect(addTask).toThrow('Task owner not a member of project');
});

test('given: existing project, when: project is marked done, then: done is changed to true', () => {
    //given
    const project = new Project({ title, description, tasks: [task1], owner: user1 });

    //when
    project.switchDone();

    //then
    expect(project.getDone()).toEqual(true);
});
