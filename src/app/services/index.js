import axios from "axios";


export const guest = axios.create({
  baseURL: process.env.REACT_APP_COOP_URL,
});

const api = axios.create({
  baseURL: process.env.REACT_APP_COOP_URL,
  credentials: 'include',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
})

api.interceptors.request.use(
  (config) => {
    const state = JSON.parse(localStorage.getItem("token"));
    const token = state?.token

    if (token) {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }

    return config
  }, (error) => Promise.reject(error)
)

export default api

// export const header = () => {
//   const access = JSON.parse(localStorage.getItem("token"));

//   if (access && access?.token) {
//     return {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${access?.token}`,
//     };
//   } else {
//     return {};
//   }
// };
