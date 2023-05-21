import { api, header } from "../../services";
import axios from "axios";

const options = {
  headers: header(),
};

export const collection = async (entity) =>
  await axios.get(`${api.url + entity}`, options);

export const bulk = async (entity, body) => {
  return await axios.post(`${api.url + entity}`, body, options);
};

export const fetch = async (entity, id) => {
  return await axios.get(`${api.url + entity}/${id}`, options);
};

export const store = async (entity, body) => {
  return await axios.post(`${api.url + entity}`, body, options);
};

export const alter = async (entity, id, body) => {
  return await axios.patch(`${api.url + entity}/${id}`, body, options);
};

export const destroy = async (entity, id) => {
  return await axios.delete(`${api.url + entity}/${id}`, options);
};

export const batchRequests = async (...arrRequests) => {
  const result = await axios.all(...arrRequests);
  return Promise.resolve(result);
};

export const printBatch = async (entity, id, body) => {
  return await axios.post(`${api.url + entity}/${id}`, body, options);
};

export const getPrinted = async (entity, id) => {
  return await axios.get(`${api.url + entity}/${id}`, {
    responseType: "blob",
    headers: header(),
  });
};
