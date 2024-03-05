import api, { guest } from "../../services";


export const login = async (data) => {
  const { email, password, device } = data;
  return await guest.post('login', { email, password, device });
};

export const logout = async () => {
  return await api.post('logout', {});
};
