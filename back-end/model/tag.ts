import {
    User as UserPrisma,
    Tag as TagPrisma,
    Task as TaskPrisma
} from '@prisma/client';
export class Tag {
    private id?: number;
    private title: string;

    constructor(tag: { id?: number; title: string }) {
        this.validate(tag);

        this.id = tag.id;
        this.title = tag.title;
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    setId(id: number) {
        this.id = id;
    }

    validate(tag: { title: string }) {
        if (!tag.title?.trim()) {
            throw new Error('Title is required');
        }
    }

    equals(tag: Tag): boolean {
        return this.id === tag.getId() && this.title === tag.getTitle();
    }

    static from({
        id, 
        title,
    }: TagPrisma) {
        return new Tag({
            id,
            title,
        });
    }
}
