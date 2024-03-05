import api from "../../services";


export const collection = async (entity) => {
    try {
      const response = await api.get(entity)
      return response
    } catch (error) {
      console.error(error);
    }
}

export const bulk = async (entity, body) => {
  try {
    const response = await api.post(entity, body)
    return response
  } catch (error) {
    console.error(error);
  }
};

export const fetch = async (entity, id) => {
  try {
    const response = await api.get(`${entity}/${id}`)
    return response
  } catch (error) {
    console.error(error);
  }
};

export const store = async (entity, body) => {

  try {
    const response = await api.post(entity, body)
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const alter = async (entity, id, body) => {
  try {
    const response = await api.patch(`${entity}/${id}`, body)
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);
  }
};

export const destroy = async (entity, id) => {
  try {
    const response = await api.delete(`${entity}/${id}`)
    return response
  } catch (error) {
    console.error(error);
  }
};

export const batchRequests = async (...arrRequests) => {

  try {
    const response = await Promise.all(arrRequests)
    return response
  } catch (error) {
    console.error(error);
  }
};

export const printBatch = async (entity, id, body) => {
  try {
    const response = await api.post(`${entity}/${id}`, body)
    return response
  } catch (error) {
    console.error(error);
  }
};

export const getPrinted = async (entity, id) => {
  try {
    const response = api.get(`${entity}/${id}`, {responseType: "blob"})
    return response
  } catch (error) {
    console.error(error);
  }
};
