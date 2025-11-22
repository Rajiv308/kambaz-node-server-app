import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    db.users.push(newUser);
    return newUser;
  };
  const findAllUsers = () => db.users;
  const findUserById = (userId) => db.users.find((user) => user._id === userId);
  const findUserByUsername = (username) => {
    let { users } = db;
    return users.find((user) => user.username === username);
  };
  const findUserByCredentials = (username, password) => {
    let { users } = db;
    return users.find(
      (user) => user.username === username && user.password === password
    );
  };
  const updateUser = (userId, userUpdates) => {
    const index = db.users.findIndex((u) => u._id === userId);
    if (index !== -1) {
      db.users[index] = { ...db.users[index], ...userUpdates };
      return db.users[index];
    }
    return null;
  };
  const deleteUser = (userId) => {
    const initialLength = db.users.length;
    db.users = db.users.filter((u) => u._id !== userId);
    return db.users.length < initialLength;
  };
  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}
