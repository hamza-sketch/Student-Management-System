

import API from "./axios.js";

//export const login = (data) => API.post("/auth/login", data);

export const login = async (data) => {
  return await API.post("/auth/login", data);
};

export const me = async () => {
  return await API.get("/auth/me");
};
