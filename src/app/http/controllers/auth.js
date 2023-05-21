import { api, header } from "../../services";
import axios from "axios";

const options = {
  headers: header(),
};

export const login = async (data) => {
  const { email, password } = data;
  return await axios.post(`${api.url}login`, { email, password });
};

export const logout = async () => {
  return await axios.post(`${api.url}logout`, {}, options);
};
