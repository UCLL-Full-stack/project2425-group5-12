import userDb from '../repository/user.db';

const getAllUsers = () => userDb.getAllUsers();

export default { getAllUsers };
