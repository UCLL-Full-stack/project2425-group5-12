import { User } from '../model/user';
import database from './database';

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({ where: { id } });
        if (!userPrisma) return null;
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({ where: { email } });
        if (!userPrisma) return null;
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                password: user.getPassword() || '',
                role: user.getRole(),
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default { getAllUsers, getUserById, getUserByEmail, createUser };
