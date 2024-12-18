import { ta } from 'date-fns/locale';
import { Tag } from '../../model/tag';
import tagDb from '../../repository/tag.db';
import tagService from '../../service/tag.service';

const tags: Tag[] = [new Tag({ id: 1, title: 'high-priority' })];

let mockTagDbCreateTag: jest.SpyInstance<Tag, [Tag]>;
let mockTagDbGetAllTags: jest.SpyInstance<Tag[]>;

beforeEach(() => {
    mockTagDbCreateTag = jest.spyOn(tagDb, 'createTag');
    mockTagDbGetAllTags = jest.spyOn(tagDb, 'getAllTags');
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: valid values for tag, when: tag is created, then: tag is created with those values', () => {
    //when
    tagService.createTag({ title: 'Development' });

    //then
    expect(mockTagDbCreateTag).toHaveBeenCalledTimes(1);
    expect(mockTagDbCreateTag).toHaveBeenLastCalledWith(
        expect.objectContaining({ title: 'Development' })
    );
});

test('given: existing tags, when: getting all tasks, then: all tasks are returned', async() => {
    //given
    mockTagDbGetAllTags.mockReturnValue(tags);

    //when
    const fetchedTags = await tagService.getAllTags();

    //then
    expect(fetchedTags.length).toEqual(1);
    expect(fetchedTags[0]).toEqual(new Tag({ id: 1, title: 'high-priority' }));
});
