import { User } from '@prisma/client';
import userDb from '../repository/user.db';
import bcrypt from 'bcrypt';
import generateJwtToken from '../util/jwt';
import { UserInput, AuthenticationResponse } from '../types';

const getAllUsers = async () => userDb.getAllUsers();

const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await userDb.getUserByEmail({ email });
    if (!user) throw new Error(`User with email: ${email} not found.`);
    const userId = user.getId();
    if (!userId) throw new Error(`User id not found.`);
    const isCorrectPassword = await bcrypt.compare(password, user.getPassword());

    if (!isCorrectPassword) throw new Error('Password incorrect.');

    return {
        token: generateJwtToken({ userEmail: email }),
        userId,
        userRole: user.getRole(),
    };
};

export default { getAllUsers, authenticate };
