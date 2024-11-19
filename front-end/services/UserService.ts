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

const UserService = {
  loginByEmail,
};

export default UserService;
