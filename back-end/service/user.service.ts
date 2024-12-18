import userDb from '../repository/user.db';
import bcrypt from 'bcrypt';
import generateJwtToken from '../util/jwt';
import { UserInput, AuthenticationResponse } from '../types';
import { User } from '../model/user';
import { Project } from '../model/project';
import projectDb from '../repository/project.db';

const getAllUsers = async () => userDb.getAllUsers();

const createUser = async ({
    firstName,
    lastName,
    email,
    password,
}: UserInput): Promise<AuthenticationResponse> => {
    const user = await userDb.getUserByEmail({ email });
    if (user) throw new Error(`User with email: ${email} already exists.`);
    if (!firstName) throw new Error('First name is required.');
    if (!lastName) throw new Error('Last name is required.');
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'USER',
    });

    const createdUser = await userDb.createUser(newUser);

    const toDo = new Project({
        title: 'TO DO',
        description: 'Your default to do list.',
        owner: createdUser,
        members: [createdUser],
    });

    await projectDb.createProject({ project: toDo });
    return {
        token: generateJwtToken({ userEmail: email, userRole: createdUser.getRole() }),
        userId: createdUser.getId() || 0,
        userRole: createdUser.getRole(),
    };
};

const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await userDb.getUserByEmail({ email });
    if (!user) throw new Error(`Problem logging in, try again!`);
    const userId = user.getId();
    if (!userId) throw new Error(`Problem logging in, try again!`);
    const userPassword = user.getPassword();
    if (!userPassword) throw new Error(`Problem logging in, try again!`);
    const isCorrectPassword = await bcrypt.compare(password, userPassword);

    if (!isCorrectPassword) throw new Error('Problem logging in, try again!');

    return {
        token: generateJwtToken({ userEmail: email, userRole: user.getRole() }),
        userId,
        userRole: user.getRole(),
    };
};

export default { getAllUsers, authenticate, createUser };
