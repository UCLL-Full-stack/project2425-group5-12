import { ta } from 'date-fns/locale';
import { Project } from './project';
import { Tag } from './tag';
import { User } from './user';
<<<<<<< Updated upstream
import {
    User as UserPrisma,
    Tag as TagPrisma,
    Task as TaskPrisma
} from '@prisma/client';
=======
import { DomainError } from './domainError';
>>>>>>> Stashed changes

export class Task {
    private id?: number;
    private title: string;
    private description: string;
    private done: boolean;
    private deadline: Date;
    private owner: User;
    private tags: Tag[];

    constructor(task: {
        id?: number;
        title: string;
        description: string;
        done?: boolean;
        deadline: Date;
        owner: User;
        tags: Tag[];
    }) {
        this.validate(task);

        this.id = task.id;
        this.title = task.title;
        this.description = task.description;
        this.done = false;
        this.deadline = task.deadline;
        this.owner = task.owner;
        this.tags = task.tags || [];
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

    getDeadline(): Date {
        return this.deadline;
    }

    getOwner(): User {
        return this.owner;
    }

    getTags(): Tag[] {
        return this.tags;
    }

    addTag(tag: Tag) {
        if (this.tags.includes(tag)) {
            throw new Error('Tag is already added');
            throw new DomainError('Tag is already added');
        }
        this.tags.push(tag);
    }

    setId(id: number) {
        this.id = id;
    }

    switchDone() {
        if (this.done) {
            this.done = false;
        } else {
            this.done = true;
        }
    }

    validate(task: { title: string; description: string; deadline: Date; owner: User }) {
        if (!task.title?.trim()) {
            throw new Error('Title is required');
            throw new DomainError('Title is required');
        }
        if (!task.description?.trim()) {
            throw new Error('Description is required');
            throw new DomainError('Description is required');
        }
        if (!task.deadline) {
            throw new Error('Deadline is required');
            throw new DomainError('Deadline is required');
        }
        if (task.deadline.getTime() < Date.now()) {
            throw new Error('Deadline cannot not be in past');
            throw new DomainError('Deadline cannot not be in past');
        }
        if (!task.owner) {
            throw new Error('owner is required');
            throw new DomainError('owner is required');
        }
    }

    equals(task: Task): boolean {
        return (
            this.id === task.getId() &&
            this.title === task.getTitle() &&
            this.description === task.getDescription() &&
            this.done === task.getDone() &&
            this.deadline === task.getDeadline() &&
            this.owner.equals(task.getOwner()) &&
            this.tags.length === task.tags.length &&
            this.tags.every((tag, index) => tag.equals(task.getTags()[index]))
        );
    }

    static from({
        id,
        title,
        description,
        done,
        deadline,
        owner,
        tags,
    }: TaskPrisma & {owner: UserPrisma; tags: TagPrisma[]}) {
        return new Task({
            id,
            title,
            description,
            done,
            deadline,
            owner: User.from(owner),
            tags: tags.map((tag) => Tag.from(tag)),
        })
    }
}
