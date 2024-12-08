import { DomainError } from './domainError';
import { Task } from './task';
import { User } from './user';
import {
    Project as ProjectPrisma,
    User as UserPrisma,
    Task as TaskPrisma,
    Tag as TagPrisma,
} from '@prisma/client';

export class Project {
    private id?: number;
    private title: string;
    private description: string;
    private done: boolean;
    private tasks: Task[];
    private members: User[];
    private owner: User;

    constructor(project: {
        id?: number;
        title: string;
        description: string;
        done?: boolean;
        tasks?: Task[];
        members?: User[];
        owner: User;
    }) {
        this.validate(project);

        this.id = project.id;
        this.title = project.title;
        this.description = project.description;
        this.done = project.done ?? false;
        this.tasks = project.tasks ? [...project.tasks] : [];
        this.owner = project.owner;
        this.members = project.members || [this.owner];
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getDone(): boolean {
        return this.done;
    }

    getTasks(): Task[] {
        return this.tasks;
    }

    getMembers(): User[] {
        return this.members;
    }

    getOwner(): User {
        return this.owner;
    }

    setId(id: number) {
        this.id = id;
    }

    addTask(task: Task) {
        if (!this.members.includes(task.getOwner())) {
            throw new DomainError('Task owner not a member of project');
        }
        if (this.tasks.includes(task)) {
            throw new DomainError('Task already in project');
        }
        this.tasks.push(task);
    }

    addMember(member: User) {
        if (this.members.includes(member)) {
            throw new DomainError('User already member of project');
        }
        this.members.push(member);
    }

    switchDone() {
        if (this.done) {
            this.done = false;
        } else {
            this.done = true;
        }
    }

    validate(project: { title: string; description: string; owner: User }) {
        if (!project.title?.trim()) {
            throw new DomainError('Title is required');
        }
        if (!project.description?.trim()) {
            throw new DomainError('Description is required');
        }
        if (!project.owner) {
            throw new DomainError('Owner is required');
        }
    }

    equals(project: Project): boolean {
        return (
            this.id === project.getId() &&
            this.title === project.getTitle() &&
            this.description === project.getDescription() &&
            this.done === project.getDone() &&
            this.owner.equals(project.getOwner()) &&
            this.tasks.length == project.getTasks().length &&
            this.tasks.every((task, index) => task.equals(project.getTasks()[index])) &&
            this.members.length == project.getMembers().length &&
            this.members.every((member, index) => member.equals(project.getMembers()[index]))
        );
    }

    static from({
        id,
        title,
        description,
        done,
        tasks,
        members,
        owner,
    }: ProjectPrisma & {
        members: UserPrisma[];
        owner: UserPrisma;
        tasks: (TaskPrisma & { owner: UserPrisma; tags: TagPrisma[] })[];
    }) {
        return new Project({
            id,
            title,
            description,
            done,
            tasks: tasks.map((task) => Task.from(task)),
            members: members.map((member) => User.fromSafe(member)),
            owner: User.fromSafe(owner),
        });
    }
}
