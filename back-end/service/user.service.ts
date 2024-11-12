import userDb from '../repository/user.db';

const getAllUsers = async () => userDb.getAllUsers();

export default { getAllUsers };
