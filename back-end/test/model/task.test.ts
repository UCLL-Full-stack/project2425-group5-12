import exp from 'constants';
import { Tag } from '../../model/tag';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import { set } from 'date-fns';
import { DomainError } from '../../model/domainError';

const deadline = set(new Date(), { year: 2025, month: 10, date: 28, hours: 15 });
const pastDeadline = set(new Date(), { year: 2023, month: 10, date: 28, hours: 15 });
const tag1 = new Tag({ title: 'high-priority' });
const tag2 = new Tag({ title: 'development' });
const tags = [tag1];
const owner = new User({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@ucll.be',
    password: 'john123',
    role: 'USER',
});
const title = 'Finish coding';
const description = 'Finish coding assignment for full-stack development.';

test('given: valid values for task, when: task is created, then: task is created with those values', () => {
    //when
    const task = new Task({
        title,
        description,
        deadline,
        owner,
        tags,
        projectId: 1,
    });

    //then
    expect(task.getTitle()).toEqual('Finish coding');
    expect(task.getDescription()).toEqual('Finish coding assignment for full-stack development.');
    expect(task.getDeadline()).toEqual(deadline);
    expect(task.getOwner()).toEqual(owner);
    expect(task.getDone()).toEqual(false);
    expect(task.getTags().length).toEqual(1);
    expect(task.getTags()[0]).toEqual(tag1);
});

test('given: invalid description for task, when: task is created, then: error is thrown', () => {
    //when
    const task = () => {
        new Task({
            title,
            description: '',
            deadline,
            owner,
            tags,
            projectId: 1,
        });
    };

    //then
    expect(task).toThrow('Description is required');
    expect(task).toThrow(DomainError);
});

test('given: existing task, when: tag is added, then: new tag is added to task', () => {
    //given
    const task = new Task({
        title,
        description,
        deadline,
        owner,
        tags,
        projectId: 1,
    });

    //when
    task.addTag(tag2);

    //then
    expect(task.getTags().length).toEqual(2);
    expect(task.getTags()[1]).toEqual(tag2);
});

test('given: existing task, when: tag is added again, then: new error is thrown', () => {
    //given
    const task = new Task({
        title,
        description,
        deadline,
        owner,
        tags,
        projectId: 1,
    });

    //when
    const addTag = () => task.addTag(tag1);

    //then
    expect(addTag).toThrow('Tag is already added');
    expect(addTag).toThrow(DomainError);
});

test('given: existing task, when: task is marked done, then: done is changed to true', () => {
    //given
    const task = new Task({
        title,
        description,
        deadline,
        owner,
        tags,
        projectId: 1,
    });

    //when
    task.switchDone();

    //then
    expect(task.getDone()).toEqual(true);
});
