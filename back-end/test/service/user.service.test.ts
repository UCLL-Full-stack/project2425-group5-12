import exp from 'constants';
import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import { AuthenticationResponse } from '../../types';

const users: User[] = [
    new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ucll.be',
        password: 'john123',
        role: 'USER',
    }),
    new User({
        firstName: 'Jane',
        lastName: 'Toe',
        email: 'jane.toe@ucll.be',
        password: 'jane123',
        role: 'USER',
    }),
];

let mockUserDbGetAllUsers: jest.SpyInstance<Promise<User[]>, []>;
let mockUserDbCreateUser: jest.SpyInstance<Promise<User>>;
let mockUserDbGetUserByEmail: jest.SpyInstance<Promise<User | null>, [{ email: string }] >;
let mockUserServiceAuthenticate: jest.SpyInstance<Promise<AuthenticationResponse>, [{ email: string, password:string }]>;


beforeEach(() => {
    mockUserDbGetAllUsers = jest.spyOn(userDb, 'getAllUsers');
    mockUserDbCreateUser = jest.spyOn(userDb, 'createUser');
    mockUserDbGetUserByEmail = jest.spyOn(userDb, 'getUserByEmail');
    mockUserServiceAuthenticate = jest.spyOn(userService, 'authenticate');
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: existing users, when: getting all users, then: all users are returned', async () => {
    //given
    mockUserDbGetAllUsers.mockResolvedValue(users);

    //when
    const result = await userService.getAllUsers();

    //then
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(
        new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@ucll.be',
            password: 'john123',
            role: 'USER',
        })
    );
    expect(result[1]).toEqual(
        new User({
            firstName: 'Jane',
            lastName: 'Toe',
            email: 'jane.toe@ucll.be',
            password: 'jane123',
            role: 'USER',
        })
    );
});

test('given: valid values for user, when: creating a user, then: user is created', () => {
    //when
    userService.createUser({
        firstName: 'Ilian',
        lastName: 'Verbruggen',
        email: 'ilian.verbruggen@ucll.be',
        password: 'ilian123',
    })

    //then 
    expect(mockUserDbCreateUser).toHaveBeenCalledTimes(1);
    expect(mockUserDbCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
            firstName: 'Ilian',
            lastName: 'Verbruggen',
            email: 'ilian.verbruggen@ucll.be',
            password: 'ilian123',
        })
    );
});

test('given: already existing user, when: creating a user, then: error is thrown', () => {
    //given 
    mockUserDbGetUserByEmail.mockResolvedValue(users[1])

    //when
    const user = () => userService.createUser({
        firstName: 'Jane',
        lastName: 'Toe',
        email: 'jane.toe@ucll.be',
        password: 'jane123',
        role: 'USER',
    })

    //then 
    expect(user).rejects.toThrow(`User with email: ${users[2].getEmail()} already exists.`);
});

test('given: invalid values for user, when: creating a user, then: error is thrown', () => {
    
    //when
    const user = () => userService.createUser({
        lastName: 'Verbruggen',
        email: 'ilian.verbruggen@ucll.be',
        password: 'ilian123',
    })

    //then 
    expect(user).rejects.toThrow('First name is required.');
});