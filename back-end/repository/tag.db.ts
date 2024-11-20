import { Tag } from '../model/tag';
import database from './database';

const getTagById = async ({ id }: { id: number }): Promise<Tag | null> => {
    try {
        const tagPrisma = await database.tag.findUnique({ where: { id } });
        if (tagPrisma) {
            return Tag.from(tagPrisma);
        }
        return null;
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const getAllTags = async (): Promise<Tag[]> => {
    try {
        const tagsPrisma = await database.tag.findMany();
        return tagsPrisma.map((tagPrisma) => Tag.from(tagPrisma));
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};
const createTag = async (tag: Tag): Promise<Tag> => {
    try {
        const tagPrisma = await database.tag.create({ data: { title: tag.getTitle() } });
        return Tag.from(tagPrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

export default { getAllTags, getTagById, createTag };
