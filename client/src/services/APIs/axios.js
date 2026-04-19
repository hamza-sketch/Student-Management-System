 
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api", // your backend URL
});

// 🔥 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle errors globally
/*
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err.response?.data || err.message);

    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);
*/
export default API;