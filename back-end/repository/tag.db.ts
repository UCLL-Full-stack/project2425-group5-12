import { Tag } from '../model/tag';
import { TagInput } from '../types';

let currentId = 1;
const tags: Tag[] = [new Tag({ id: currentId++, title: 'high-priority' })];

const getTagById = ({ id }: { id: number }): Tag | null => {
    const tag = tags.find((tag) => tag.getId() === id);
    return tag || null;
};

const getAllTags = () => tags;

const createTag = (tag: Tag): Tag => {
    tag.setId(currentId++);
    tags.push(tag);
    return tag;
};
export default { getAllTags, getTagById, createTag };
