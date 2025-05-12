import axiosInstance from "./axios.handler";

interface ILogin {
  email: string;
  password: string;
}

const login = async ({ email, password }: ILogin) => {
  const { data, status } = await axiosInstance.post("/users/auth", {
    email,
    password,
  });
  if (!data) {
    return null;
  }
  return true;
};

const logout = async () => {
  const response = await axiosInstance.post('/users/logout');

  console.log(response.data);

}



export default {
  login,
  logout
};
