import axios from "axios";

const api = axios.create({
    baseURL: "/api",
  });

export const setAuthToken = (token = localStorage.getItem("token")) => {
    if (token) api.defaults.headers.common["Authorization"] = "Bearer " + token;
    else delete api.defaults.headers.common["Authorization"];
};

export default api;
