import { Tag } from '../model/tag';
import tagDb from '../repository/tag.db';
import { TagInput } from '../types';

const getAllTags = (): Tag[] => tagDb.getAllTags();

const createTag = ({ title }: TagInput): Tag => {
    const tag = new Tag({ title });
    return tagDb.createTag(tag);
};

export default { getAllTags, createTag };
