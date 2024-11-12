import { User } from '../model/user';
import database from './database';

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({ where: { id } });
        if (!userPrisma) return null;
        return User.from(userPrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

export default { getAllUsers, getUserById };
