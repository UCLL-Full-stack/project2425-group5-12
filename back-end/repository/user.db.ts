import { User } from '../model/user';

let currentId = 1;
const users: User[] = [
    new User({
        id: currentId++,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ucll.be',
        password: 'john123',
        role: 'user',
    }),
    new User({
        id: currentId++,
        firstName: 'Jane',
        lastName: 'Toe',
        email: 'jane.toe@ucll.be',
        password: 'jane123',
        role: 'user',
    }),
];

const getUserById = ({ id }: { id: number }): User | null => {
    const user = users.find((user) => user.getId() === id);
    return user || null;
};

const getAllUsers = (): User[] => users;

export default { getAllUsers, getUserById };
