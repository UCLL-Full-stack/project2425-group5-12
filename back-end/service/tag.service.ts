import { Tag } from '../model/tag';
import tagDb from '../repository/tag.db';
import { TagInput } from '../types';

const getAllTags = async(): Promise<Tag[]> => tagDb.getAllTags();

const createTag = async ({ title }: TagInput): Promise<Tag> => {
    const tag = new Tag({ title });
    return tagDb.createTag(tag);
};

export default { getAllTags, createTag };
