const loginByEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
};

const getAllUsers = async () => {
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const UserService = {
  loginByEmail,
  createUser,
  getAllUsers,
};

export default UserService;
