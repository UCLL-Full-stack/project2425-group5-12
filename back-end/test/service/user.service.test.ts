import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';

const users: User[] = [
    new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ucll.be',
        password: 'john123',
        role: 'user',
    }),
    new User({
        firstName: 'Jane',
        lastName: 'Toe',
        email: 'jane.toe@ucll.be',
        password: 'jane123',
        role: 'user',
    }),
];

let mockUserDbGetAllUsers: jest.SpyInstance<User[]>;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.spyOn(userDb, 'getAllUsers');
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: existing users, when: getting all users, then: all users are returned', () => {
    //given
    mockUserDbGetAllUsers.mockReturnValue(users);

    //when
    const result = userService.getAllUsers();

    //then
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(
        new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@ucll.be',
            password: 'john123',
            role: 'user',
        })
    );
    expect(result[1]).toEqual(
        new User({
            firstName: 'Jane',
            lastName: 'Toe',
            email: 'jane.toe@ucll.be',
            password: 'jane123',
            role: 'user',
        })
    );
});
