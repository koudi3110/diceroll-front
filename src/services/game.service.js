import api from "./api";

const createGame = async (data) => {
  try {
    const response = await api.post(`dice/create`, data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw message;
  }
};

const join = async ({ id, data }) => {
  try {
    const response = await api.post(`dice/join/${id}`, data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    console.log("error-----------", message);
    throw message;
  }
};

const keepOut = async ({ id, data }) => {
  try {
    const response = await api.post(`dice/keepout/${id}`, data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw message;
  }
};

const deleteGame = async (id) => {
  try {
    const response = await api.delete(`dice/${id}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    console.log("error-----------", message);
    throw message;
  }
};

const initGame = async (id) => {
  try {
    const response = await api.get(`dice/init/${id}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    console.log("error-----------", message);
    throw message;
  }
};

const getScores = async () => {
  return api.get(`scores/get-latest-scores`).then((response) => {
    return response.data;
  });
};

const getHistory = ({ account, number }) => {
  const start = performance.now();
  return api.get(`finances/history/${account}/${number}`).then((response) => {
    const end = performance.now();
    // console.log(`getHistory`, start - end);
    return response.data;
  });
};

const sessionStatus = async (id) => {
  return api.get(`dice/status/${id}`).then((response) => {
    return response.data;
  });
};

const launch = async ({ id, data }) => {
  return api.post(`dice/roll/${id}`, data).then((response) => {
    return response.data;
  });
};

export default {
  join,
  keepOut,
  deleteGame,
  initGame,
  createGame,
  getHistory,
  getScores,
  sessionStatus,
  launch,
};
