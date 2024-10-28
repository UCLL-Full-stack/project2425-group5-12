export class Tag {
    private id?: number;
    private title: string;

    constructor(tag: { id?: number; title: string }) {
        this.validate(tag);

        this.title = tag.title;
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    validate(tag: { title: string }) {
        if (!tag.title?.trim()) {
            throw new Error('Title is required');
        }
    }

    equals(tag: Tag): boolean {
        return this.id === tag.getId() && this.title === tag.getTitle();
    }
}
