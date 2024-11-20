import { Tag } from './tag';
import { User } from './user';
import { User as UserPrisma, Tag as TagPrisma, Task as TaskPrisma } from '@prisma/client';
import { DomainError } from './domainError';

export class Task {
    private id?: number;
    private title: string;
    private description: string;
    private done: boolean;
    private deadline: Date;
    private owner: User;
    private tags: Tag[];
    private projectId: number;

    constructor(task: {
        id?: number;
        title: string;
        description: string;
        done?: boolean;
        deadline: Date;
        owner: User;
        tags: Tag[];
        projectId: number;
    }) {
        this.validate(task);

        this.id = task.id;
        this.title = task.title;
        this.description = task.description;
        this.done = task.done ?? false;
        this.deadline = task.deadline;
        this.owner = task.owner;
        this.tags = task.tags ? [...task.tags] : [];
        this.projectId = task.projectId;
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

    getProjectId(): number {
        return this.projectId;
    }

    getTags(): Tag[] {
        return this.tags;
    }

    addTag(tag: Tag) {
        if (this.tags.includes(tag)) {
            throw new DomainError('Tag is already added');
        }
        this.tags.push(tag);
    }

    setId(id: number) {
        this.id = id;
    }

    switchDone() {
        this.done = !this.done;
    }

    validate(task: {
        title: string;
        description: string;
        deadline: Date;
        owner: User;
        projectId: number;
    }) {
        if (!task.title?.trim()) {
            throw new DomainError('Title is required');
        }
        if (!task.description?.trim()) {
            throw new DomainError('Description is required');
        }
        if (!task.deadline) {
            throw new DomainError('Deadline is required');
        }
        if (task.deadline.getTime() < Date.now()) {
            throw new DomainError('Deadline cannot not be in past');
        }
        if (!task.owner) {
            throw new DomainError('owner is required');
        }
        if (!task.projectId) {
            throw new DomainError('Project ID is required');
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
            this.tags.every((tag, index) => tag.equals(task.getTags()[index])) &&
            this.projectId === task.projectId
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
        projectId,
    }: TaskPrisma & { owner: UserPrisma; tags: TagPrisma[] }) {
        return new Task({
            id,
            title,
            description,
            done,
            deadline,
            projectId,
            owner: User.from(owner),
            tags: tags.map((tag) => Tag.from(tag)),
        });
    }
}
