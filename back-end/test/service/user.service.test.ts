import { Project } from '../../model/project';
import { User } from '../../model/user';
import projectDb from '../../repository/project.db';
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

const project = new Project({ title: 'fullstack', description: 'fullstack', owner: users[0] });

let mockUserDbGetAllUsers: jest.SpyInstance<Promise<User[]>, []>;
let mockUserDbCreateUser: jest.SpyInstance<Promise<User>, [User]>;
let mockUserDbGetUserByEmail: jest.SpyInstance<Promise<User | null>, [{ email: string }]>;
let mockUserServiceAuthenticate: jest.SpyInstance<
    Promise<AuthenticationResponse>,
    [{ email: string; password: string }]
>;
let mockProjectDbCreateProject: jest.SpyInstance<Promise<Project>, [{ project: Project }]>;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.spyOn(userDb, 'getAllUsers');
    mockUserDbCreateUser = jest.spyOn(userDb, 'createUser');
    mockUserDbGetUserByEmail = jest.spyOn(userDb, 'getUserByEmail');
    mockUserServiceAuthenticate = jest.spyOn(userService, 'authenticate');
    mockProjectDbCreateProject = jest.spyOn(projectDb, 'createProject');
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

test('given: valid values for user, when: creating a user, then: user is created', async () => {
    mockUserDbGetUserByEmail.mockResolvedValue(null);
    mockUserDbCreateUser.mockImplementation(async (user) => {
        return user || null; // Ensure the mock returns a User instance
    });
    mockProjectDbCreateProject.mockResolvedValue(project);

    //when
    const result = await userService.createUser({
        firstName: 'Ilian',
        lastName: 'Verbruggen',
        email: 'iliantest.verbruggen@ucll.be',
        password: 'ilian123',
        role: 'USER',
    });

    //then
    expect(mockUserDbCreateUser).toHaveBeenCalledTimes(1);
    expect(mockUserDbCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
            firstName: 'Ilian',
            lastName: 'Verbruggen',
            email: 'iliantest.verbruggen@ucll.be',
            role: 'USER',
        })
    );
});

test('given: already existing user, when: creating a user, then: error is thrown', async () => {
    //given
    mockUserDbGetUserByEmail.mockResolvedValue(users[1]);

    //when & then
    await expect(
        userService.createUser({
            firstName: 'Jane',
            lastName: 'Toe',
            email: 'jane.toe@ucll.be',
            password: 'jane123',
            role: 'USER',
        })
    ).rejects.toThrow(`User with email: ${users[1].getEmail()} already exists.`);
});

test('given: invalid values for user, when: creating a user, then: error is thrown', async () => {
    mockUserDbGetUserByEmail.mockResolvedValue(null);

    //when & then
    await expect(
        userService.createUser({
            firstName: '',
            lastName: 'Verbruggen',
            email: 'ilian.verbruggen@ucll.be',
            password: 'ilian123',
        })
    ).rejects.toThrow('First name is required.');
});
