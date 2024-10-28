import { Task } from './task';
import { User } from './user';

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

        this.title = project.title;
        this.description = project.description;
        this.done = false;
        this.tasks = project.tasks || [];
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

    addTask(task: Task) {
        if (!this.members.includes(task.getOwner())) {
            throw new Error('Task owner not a member of project');
        }
        if (this.tasks.includes(task)) {
            throw new Error('Task already in project');
        }
        this.tasks.push(task);
    }

    addMember(member: User) {
        if (this.members.includes(member)) {
            throw new Error('User already member of project');
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
            throw new Error('Title is required');
        }
        if (!project.description?.trim()) {
            throw new Error('Description is required');
        }
        if (!project.owner) {
            throw new Error('Owner is required');
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
}
