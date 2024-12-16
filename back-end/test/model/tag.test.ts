import { DomainError } from '../../model/domainError';
import { Tag } from '../../model/tag';

test('given: valid values for tag, when: tag is created, then: tag is created with those values', () => {
    //when
    const tag = new Tag({ title: 'high-priority' });

    //then
    expect(tag.getTitle()).toEqual('high-priority');
});

test('given: invalid title for tag, when: tag is created, then: error is thrown', () => {
    //when
    const tag = () => new Tag({ title: '' });

    //then
    expect(tag).toThrow('Title is required');
    expect(tag).toThrow(DomainError);
});
