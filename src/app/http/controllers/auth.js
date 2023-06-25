import { api, header } from "../../services";
import axios from "axios";

const options = {
  headers: header(),
};

export const login = async (data) => {
  const { email, password, device } = data;
  return await axios.post(`${api.url}login`, { email, password, device });
};

export const logout = async () => {
  return await axios.post(`${api.url}logout`, {}, options);
};
