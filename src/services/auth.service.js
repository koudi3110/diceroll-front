import api from "./api";

const visitor = async () => {
  return api.get("auth/anonyme").then((response) => {
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  });
};

const login = async (username) => {
  return api.post("auth/signin", { username }).then((response) => {
    // localStorage.setItem("user", JSON.stringify(response.data.data));
    return response.data;
  });
};

const logout = () => {
  // localStorage.removeItem("@Auth:token");
  localStorage.removeItem("user");
  return "true";
};
const authService = {
  visitor,
  login,
  logout,
};
export default authService;
